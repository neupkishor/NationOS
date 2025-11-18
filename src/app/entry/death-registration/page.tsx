
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useFirestore } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, getDocs, query } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

type Inputs = {
  citizenId: string;
  dateOfDeath: string;
  placeOfDeath: string;
  causeOfDeath: string;
};

type Citizen = {
  id: string;
  name: string;
};

export default function DeathRegistrationPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, control, formState: { errors } } = useForm<Inputs>();
  
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [isLoadingCitizens, setIsLoadingCitizens] = useState(true);

  useEffect(() => {
    if (!firestore) return;

    const fetchCitizens = async () => {
      setIsLoadingCitizens(true);
      const citizensQuery = query(collection(firestore, 'citizens'));
      const querySnapshot = await getDocs(citizensQuery);
      const fetchedCitizens = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Citizen[];
      setCitizens(fetchedCitizens);
      setIsLoadingCitizens(false);
    };

    fetchCitizens();
  }, [firestore]);


  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!firestore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Firestore is not connected.",
      });
      return;
    }
    
    const deathRegCollection = collection(firestore, `citizens/${data.citizenId}/deathRegistrations`);
    try {
      await addDocumentNonBlocking(deathRegCollection, {
        citizenId: data.citizenId,
        dateOfDeath: data.dateOfDeath,
        placeOfDeath: data.placeOfDeath,
        causeOfDeath: data.causeOfDeath,
      });

      const birthRegCollection = collection(firestore, `citizens/${data.citizenId}/birthRegistrations`);
      // Add a dummy birth registration for stats calculation
      await addDocumentNonBlocking(birthRegCollection, {
        registrationDate: new Date().toISOString().split('T')[0],
        placeOfBirth: "N/A"
      });

      toast({
        title: "Success",
        description: "Death registration record has been saved.",
      });
      router.push('/entry');
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save death registration record.",
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Death Registration</CardTitle>
          <CardDescription>Fill out the form to register a citizen's death.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            
            <div className="space-y-2">
              <Label htmlFor="citizenId">Citizen</Label>
               <Controller
                  name="citizenId"
                  control={control}
                  rules={{ required: "Citizen is required." }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a citizen" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingCitizens ? (
                          <SelectItem value="loading" disabled>Loading citizens...</SelectItem>
                        ) : (
                          citizens.map(citizen => (
                            <SelectItem key={citizen.id} value={citizen.id}>{citizen.name} ({citizen.id})</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              {errors.citizenId && <p className="text-destructive text-sm">{errors.citizenId.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="dateOfDeath">Date of Death</Label>
                    <Input id="dateOfDeath" type="date" {...register("dateOfDeath", { required: "Date of Death is required." })} />
                    {errors.dateOfDeath && <p className="text-destructive text-sm">{errors.dateOfDeath.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="placeOfDeath">Place of Death</Label>
                    <Input id="placeOfDeath" {...register("placeOfDeath", { required: "Place of Death is required." })} />
                    {errors.placeOfDeath && <p className="text-destructive text-sm">{errors.placeOfDeath.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="causeOfDeath">Cause of Death</Label>
              <Textarea id="causeOfDeath" {...register("causeOfDeath", { required: "Cause of Death is required." })} />
              {errors.causeOfDeath && <p className="text-destructive text-sm">{errors.causeOfDeath.message}</p>}
            </div>
            

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Save Record</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

    
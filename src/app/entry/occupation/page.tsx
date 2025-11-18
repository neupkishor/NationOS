
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

type Inputs = {
  citizenId: string;
  occupation: string;
  salary: number;
  employmentStatus: string;
};

type Citizen = {
  id: string;
  name: string;
};

export default function OccupationEntryPage() {
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
    
    const employmentCollection = collection(firestore, `citizens/${data.citizenId}/employments`);
    try {
      await addDocumentNonBlocking(employmentCollection, {
        citizenId: data.citizenId,
        occupation: data.occupation,
        salary: Number(data.salary),
        employmentStatus: data.employmentStatus
      });
      toast({
        title: "Success",
        description: "Occupation record has been saved.",
      });
      router.push('/entry');
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save occupation record.",
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Occupation Data Entry</CardTitle>
          <CardDescription>Add an occupation record for a citizen.</CardDescription>
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
            
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input id="occupation" {...register("occupation", { required: "Occupation is required." })} />
              {errors.occupation && <p className="text-destructive text-sm">{errors.occupation.message}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="salary">Salary (Annual)</Label>
                    <Input id="salary" type="number" {...register("salary")} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="employmentStatus">Employment Status</Label>
                    <Controller
                        name="employmentStatus"
                        control={control}
                        rules={{ required: "Status is required." }}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Employed">Employed</SelectItem>
                                <SelectItem value="Unemployed">Unemployed</SelectItem>
                                <SelectItem value="Student">Student</SelectItem>
                                <SelectItem value="Retired">Retired</SelectItem>
                            </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.employmentStatus && <p className="text-destructive text-sm">{errors.employmentStatus.message}</p>}
                </div>
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

    
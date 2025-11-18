
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
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
};

type Citizen = {
  id: string;
  name: string;
};

export default function EducationEntryPage() {
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
    
    const educationCollection = collection(firestore, `citizens/${data.citizenId}/education`);
    try {
      await addDocumentNonBlocking(educationCollection, {
        citizenId: data.citizenId,
        institution: data.institution,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy,
        graduationYear: data.graduationYear,
      });
      toast({
        title: "Success",
        description: "Education record has been saved.",
      });
      router.push('/entry');
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save education record.",
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Education Data Entry</CardTitle>
          <CardDescription>Add an education record for a citizen.</CardDescription>
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
              <Label htmlFor="institution">Institution Name</Label>
              <Input id="institution" {...register("institution", { required: "Institution is required." })} />
              {errors.institution && <p className="text-destructive text-sm">{errors.institution.message}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="degree">Degree/Qualification</Label>
                    <Input id="degree" {...register("degree", { required: "Degree is required." })} />
                    {errors.degree && <p className="text-destructive text-sm">{errors.degree.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fieldOfStudy">Field of Study</Label>
                    <Input id="fieldOfStudy" {...register("fieldOfStudy", { required: "Field of study is required." })} />
                    {errors.fieldOfStudy && <p className="text-destructive text-sm">{errors.fieldOfStudy.message}</p>}
                </div>
            </div>

             <div className="space-y-2">
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Input id="graduationYear" type="number" {...register("graduationYear", { required: "Graduation year is required." })} />
                {errors.graduationYear && <p className="text-destructive text-sm">{errors.graduationYear.message}</p>}
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

    
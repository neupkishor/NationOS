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
  name: string;
  dateOfBirth: string;
  gender: string;
  citizenshipNumber: string;
  citizenshipType: string;
  currentLocation: string;
  location: string;
};

type Region = {
  id: string;
  name: string;
};

export default function CitizenEntryPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, control, formState: { errors } } = useForm<Inputs>();
  
  const [regions, setRegions] = useState<Region[]>([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(true);

  useEffect(() => {
    if (!firestore) return;

    const fetchRegions = async () => {
      setIsLoadingRegions(true);
      const regionsQuery = query(collection(firestore, 'regions'));
      const querySnapshot = await getDocs(regionsQuery);
      const fetchedRegions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Region[];
      setRegions(fetchedRegions);
      setIsLoadingRegions(false);
    };

    fetchRegions();
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
    
    const citizensCollection = collection(firestore, "citizens");
    try {
      await addDocumentNonBlocking(citizensCollection, data);
      toast({
        title: "Success",
        description: "Citizen record has been saved.",
      });
      router.push('/entry');
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save citizen record.",
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Citizen Data Entry</CardTitle>
          <CardDescription>Fill out the form to add a new citizen record.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name", { required: true })} />
              {errors.name && <p className="text-destructive text-sm">Name is required.</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" type="date" {...register("dateOfBirth", { required: true })} />
                {errors.dateOfBirth && <p className="text-destructive text-sm">Date of Birth is required.</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                 {errors.gender && <p className="text-destructive text-sm">Gender is required.</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="citizenshipNumber">Citizenship Number</Label>
                <Input id="citizenshipNumber" {...register("citizenshipNumber", { required: true })} />
                {errors.citizenshipNumber && <p className="text-destructive text-sm">Citizenship Number is required.</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="citizenshipType">Citizenship Type</Label>
                <Controller
                  name="citizenshipType"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="by_birth">By Birth</SelectItem>
                        <SelectItem value="naturalized">Naturalized</SelectItem>
                        <SelectItem value="by_descent">By Descent</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.citizenshipType && <p className="text-destructive text-sm">Citizenship Type is required.</p>}
              </div>
            </div>
            
             <div className="space-y-2">
              <Label htmlFor="currentLocation">Current Location</Label>
               <Controller
                  name="currentLocation"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select current location" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingRegions ? (
                          <SelectItem value="loading" disabled>Loading regions...</SelectItem>
                        ) : (
                          regions.map(region => (
                            <SelectItem key={region.id} value={region.name}>{region.name}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              {errors.currentLocation && <p className="text-destructive text-sm">Current Location is required.</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Permanent Location / Address</Label>
               <Controller
                  name="location"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select permanent location" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingRegions ? (
                          <SelectItem value="loading" disabled>Loading regions...</SelectItem>
                        ) : (
                          regions.map(region => (
                            <SelectItem key={region.id} value={region.name}>{region.name}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              {errors.location && <p className="text-destructive text-sm">Location is required.</p>}
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

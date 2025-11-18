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
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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

export default function EditCitizenPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<Inputs>();
  
  const [regions, setRegions] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!firestore) return;

    const fetchInitialData = async () => {
      setIsLoading(true);
      
      // Fetch regions
      const regionsQuery = query(collection(firestore, 'regions'));
      const regionsSnapshot = await getDocs(regionsQuery);
      const fetchedRegions = regionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Region[];
      setRegions(fetchedRegions);

      // Fetch citizen data
      const citizenRef = doc(firestore, 'citizens', params.id);
      const citizenSnap = await getDoc(citizenRef);

      if (citizenSnap.exists()) {
        const citizenData = citizenSnap.data() as Inputs;
        // Set form values
        Object.keys(citizenData).forEach(key => {
          setValue(key as keyof Inputs, citizenData[key as keyof Inputs]);
        });
      }

      setIsLoading(false);
    };

    fetchInitialData();
  }, [firestore, params.id, setValue]);


  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!firestore) {
      toast({ variant: "destructive", title: "Error", description: "Firestore is not connected." });
      return;
    }
    
    const citizenRef = doc(firestore, "citizens", params.id);
    try {
      await updateDocumentNonBlocking(citizenRef, data);
      toast({ title: "Success", description: "Citizen record has been updated." });
      router.push(`/citizens/${params.id}`);
    } catch (error) {
      console.error("Error updating document: ", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to update citizen record." });
    }
  };

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Citizen Record</CardTitle>
          <CardDescription>Update the details for this citizen.</CardDescription>
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
                      <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
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
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
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
                      <SelectTrigger><SelectValue placeholder="Select current location" /></SelectTrigger>
                      <SelectContent>
                        {regions.map(region => (<SelectItem key={region.id} value={region.name}>{region.name}</SelectItem>))}
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
                      <SelectTrigger><SelectValue placeholder="Select permanent location" /></SelectTrigger>
                      <SelectContent>
                        {regions.map(region => (<SelectItem key={region.id} value={region.name}>{region.name}</SelectItem>))}
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
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

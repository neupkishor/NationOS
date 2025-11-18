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
import { useForm, SubmitHandler } from "react-hook-form";
import { useFirestore } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type Inputs = {
  name: string;
  dateOfBirth: string;
  gender: string;
  citizenshipNumber: string;
  citizenshipType: string;
  currentLocation: string;
  location: string;
};

export default function CitizenEntryPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

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
                <Select {...register("gender")} onValueChange={(value) => {}}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
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
                 <Select {...register("citizenshipType")} onValueChange={(value) => {}}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="by_birth">By Birth</SelectItem>
                    <SelectItem value="naturalized">Naturalized</SelectItem>
                     <SelectItem value="by_descent">By Descent</SelectItem>
                  </SelectContent>
                </Select>
                {errors.citizenshipType && <p className="text-destructive text-sm">Citizenship Type is required.</p>}
              </div>
            </div>
            
             <div className="space-y-2">
              <Label htmlFor="currentLocation">Current Location</Label>
              <Input id="currentLocation" {...register("currentLocation", { required: true })} />
              {errors.currentLocation && <p className="text-destructive text-sm">Current Location is required.</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Permanent Location / Address</Label>
              <Input id="location" {...register("location", { required: true })} />
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

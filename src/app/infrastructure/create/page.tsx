
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
import { collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type Inputs = {
  infrastructureType: string;
  location: string;
  status: string;
  nature: string;
  startDate: string;
};

export default function CreateInfrastructurePage() {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, control, formState: { errors } } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!firestore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Firestore is not connected.",
      });
      return;
    }
    
    const infraCollection = collection(firestore, "infrastructures");
    try {
      await addDocumentNonBlocking(infraCollection, data);
      toast({
        title: "Success",
        description: "Infrastructure project has been saved.",
      });
      router.push('/infrastructure');
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save project.",
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Infrastructure Project</CardTitle>
          <CardDescription>Fill out the form to add a new project.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="infrastructureType">Project Type</Label>
              <Input id="infrastructureType" {...register("infrastructureType", { required: true })} placeholder="e.g., School, Road, Hospital" />
              {errors.infrastructureType && <p className="text-destructive text-sm">Type is required.</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register("location", { required: true })} placeholder="e.g., Capital City, District B" />
                {errors.location && <p className="text-destructive text-sm">Location is required.</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nature">Nature</Label>
                <Controller
                  name="nature"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select nature" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Public">Public</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                 {errors.nature && <p className="text-destructive text-sm">Nature is required.</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Building">Building</SelectItem>
                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                        <SelectItem value="Built">Built</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                 {errors.status && <p className="text-destructive text-sm">Status is required.</p>}
              </div>
            </div>
            
             <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" {...register("startDate", { required: true })} />
                {errors.startDate && <p className="text-destructive text-sm">Start date is required.</p>}
              </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Save Project</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

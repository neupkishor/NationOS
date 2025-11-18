
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
import { addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, getDocs, query, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

type Inputs = {
  citizenId: string;
  newLocation: string;
};

type Citizen = {
  id: string;
  name: string;
  currentLocation: string;
};

type Region = {
    id: string;
    name: string;
}

export default function ResidencyEntryPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<Inputs>();
  
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedCitizenId = watch('citizenId');
  const selectedCitizen = citizens.find(c => c.id === selectedCitizenId);

  useEffect(() => {
    if (!firestore) return;

    const fetchData = async () => {
      setIsLoading(true);
      const citizensQuery = query(collection(firestore, 'citizens'));
      const citizensSnapshot = await getDocs(citizensQuery);
      const fetchedCitizens = citizensSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Citizen[];
      setCitizens(fetchedCitizens);

      const regionsQuery = query(collection(firestore, 'regions'));
      const regionsSnapshot = await getDocs(regionsQuery);
      const fetchedRegions = regionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Region[];
      setRegions(fetchedRegions);

      setIsLoading(false);
    };

    fetchData();
  }, [firestore]);


  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!firestore || !selectedCitizen) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Firestore is not connected or citizen not selected.",
      });
      return;
    }
    
    // 1. Create migration history record
    const migrationCollection = collection(firestore, `citizens/${data.citizenId}/migrationHistories`);
    await addDocumentNonBlocking(migrationCollection, {
        citizenId: data.citizenId,
        migrationDate: new Date().toISOString(),
        fromLocation: selectedCitizen.currentLocation,
        toLocation: data.newLocation,
    });

    // 2. Update citizen's current location
    const citizenRef = doc(firestore, 'citizens', data.citizenId);
    await updateDocumentNonBlocking(citizenRef, { currentLocation: data.newLocation });

    toast({
        title: "Success",
        description: "Residency has been updated and migration recorded.",
    });
    router.push('/entry');
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Residency Data Entry</CardTitle>
          <CardDescription>Update a citizen's current residency and record the migration.</CardDescription>
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
                        {isLoading ? (
                          <SelectItem value="loading" disabled>Loading...</SelectItem>
                        ) : (
                          citizens.map(citizen => (
                            <SelectItem key={citizen.id} value={citizen.id}>{citizen.name}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              {errors.citizenId && <p className="text-destructive text-sm">{errors.citizenId.message}</p>}
            </div>
            
            {selectedCitizen && (
                <div className="space-y-2">
                    <Label htmlFor="previousLocation">Previous Residency</Label>
                    <Input id="previousLocation" value={selectedCitizen.currentLocation} readOnly disabled />
                </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="newLocation">New Residency</Label>
               <Controller
                  name="newLocation"
                  control={control}
                  rules={{ required: "New residency is required." }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select new location" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoading ? (
                          <SelectItem value="loading" disabled>Loading...</SelectItem>
                        ) : (
                          regions.map(region => (
                            <SelectItem key={region.id} value={region.name}>{region.name}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              {errors.newLocation && <p className="text-destructive text-sm">{errors.newLocation.message}</p>}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={!selectedCitizen}>Save Record</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

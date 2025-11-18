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
import Link from "next/link";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, query } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Region = {
  id: string;
  name: string;
  type: string;
};

export default function CreateOrganizationPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const [orgName, setOrgName] = useState('');
  const [regionId, setRegionId] = useState('');
  const [location, setLocation] = useState('');

  const regionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'regions'));
  }, [firestore]);

  const { data: regions, isLoading: isLoadingRegions } = useCollection<Region>(regionsQuery);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !orgName || !regionId || !location) {
      // Basic validation
      alert("Please fill all fields");
      return;
    };
    const orgsCollection = collection(firestore, "organizations");
    await addDocumentNonBlocking(orgsCollection, {
      name: orgName,
      regionId,
      location,
    });
    router.push('/setup/organization');
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Organization</CardTitle>
          <CardDescription>Fill out the details to add a new organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleCreate}>
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input id="org-name" placeholder="e.g., Ministry of Health" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select name="region" onValueChange={setRegionId} value={regionId}>
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingRegions ? (
                     <SelectItem value="loading" disabled>Loading regions...</SelectItem>
                  ) : (
                    regions?.map(region => (
                      <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
               <Input id="location" placeholder="e.g., Capital City" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
               <Button variant="outline" asChild>
                <Link href="/setup/organization">Cancel</Link>
              </Button>
              <Button type="submit">Create Organization</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
    
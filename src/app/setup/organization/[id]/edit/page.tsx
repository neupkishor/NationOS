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
import { useFirestore, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import { doc, collection, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";

type Region = {
  id: string;
  name: string;
  type: string;
};

type Organization = {
  id: string;
  name: string;
  regionId: string;
  location: string;
};

export default function EditOrganizationPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const router = useRouter();

  const orgRef = useMemoFirebase(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, "organizations", params.id);
  }, [firestore, params.id]);

  const { data: organization, isLoading: isLoadingOrg } = useDoc<Organization>(orgRef);

  const regionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'regions'));
  }, [firestore]);

  const { data: regions, isLoading: isLoadingRegions } = useCollection<Region>(regionsQuery);

  const [name, setName] = useState('');
  const [regionId, setRegionId] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (organization) {
      setName(organization.name);
      setRegionId(organization.regionId);
      setLocation(organization.location);
    }
  }, [organization]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgRef) return;
    await updateDocumentNonBlocking(orgRef, { name, regionId, location });
    router.push('/setup/organization');
  };
  
  if (isLoadingOrg) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Organization</CardTitle>
          <CardDescription>Editing details for organization ID: {params.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSave}>
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input id="org-name" placeholder="e.g., Ministry of Health" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select name="region" value={regionId} onValueChange={setRegionId}>
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
               <Input id="location" placeholder="e.g., Capital City" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" asChild>
                <Link href="/setup/organization">Cancel</Link>
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
    
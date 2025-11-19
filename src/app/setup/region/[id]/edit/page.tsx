'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useFirestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";

type Region = {
  id: string;
  name: string;
  type: string;
}

export default function EditRegionPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const router = useRouter();

  const [region, setRegion] = useState<Region | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    if (!firestore || !params.id) return;

    const fetchRegion = async () => {
      setIsLoading(true);
      const regionRef = doc(firestore, 'regions', params.id);
      const docSnap = await getDoc(regionRef);

      if (docSnap.exists()) {
        const regionData = { id: docSnap.id, ...docSnap.data() } as Region;
        setRegion(regionData);
        setName(regionData.name);
        setType(regionData.type);
      } else {
        console.log("No such document!");
      }
      setIsLoading(false);
    }
    
    fetchRegion();
  }, [firestore, params.id]);


  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;
    const regionRef = doc(firestore, 'regions', params.id);
    updateDocumentNonBlocking(regionRef, { name, type });
    router.push('/setup/region');
  };

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!region && !isLoading) {
    return <div>Region not found.</div>
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Region</CardTitle>
          <CardDescription>Editing details for region ID: {params.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSave}>
            <div className="space-y-2">
              <Label htmlFor="region-name">Region Name</Label>
              <Input id="region-name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region-type">Region Type</Label>
              <Input id="region-type" value={type} onChange={e => setType(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" asChild>
                <Link href="/setup/region">Cancel</Link>
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
    
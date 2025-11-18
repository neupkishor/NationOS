'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useFirestore } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection } from "firebase/firestore";
import { useRouter } from "next/navigation";


export default function CreateRegionPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !name || !type) return;

    const regionsCollection = collection(firestore, "regions");
    
    // The addDoc promise resolves with a DocumentReference to the newly created document.
    const docRefPromise = addDocumentNonBlocking(regionsCollection, { name, type });
    
    // We can get the ID from the resolved DocumentReference
    const docRef = await docRefPromise;
    
    // Now update the document with its own ID
    // Note: We're not using a non-blocking update here because we need to ensure this completes
    // before we navigate away.
    if(docRef) {
       router.push('/setup/region');
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Region</CardTitle>
          <CardDescription>Fill out the details to add a new region.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleCreate}>
            <div className="space-y-2">
              <Label htmlFor="region-name">Region Name</Label>
              <Input id="region-name" placeholder="e.g., District B" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region-type">Region Type</Label>
              <Input id="region-type" placeholder="e.g., District, Ward" value={type} onChange={e => setType(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" asChild>
                <Link href="/setup/region">Cancel</Link>
              </Button>
              <Button type="submit">Create Region</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
    
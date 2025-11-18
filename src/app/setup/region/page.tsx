'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useFirestore } from "@/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";

type Region = {
  id: string,
  name: string;
  type: string;
}

export default function RegionSetupPage() {
  const firestore = useFirestore();
  const [regions, setRegions] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!firestore) return;

    const fetchRegions = async () => {
      setIsLoading(true);
      const regionsQuery = query(collection(firestore, 'regions'));
      const querySnapshot = await getDocs(regionsQuery);
      const fetchedRegions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Region[];
      setRegions(fetchedRegions);
      setIsLoading(false);
    };

    fetchRegions();
  }, [firestore]);


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Regions</h2>
          <p className="text-muted-foreground">
            Manage administrative regions, districts, and wards.
          </p>
        </div>
        <Button asChild>
          <Link href="/setup/region/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Region
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                 <TableRow>
                  <TableCell colSpan={3} className="text-center">Loading regions...</TableCell>
                </TableRow>
              )}
              {!isLoading && regions?.map((region) => (
                <TableRow key={region.id}>
                  <TableCell className="font-medium">{region.name}</TableCell>
                  <TableCell>{region.type}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/setup/region/${region.id}/edit`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
               {!isLoading && regions?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No regions found. Create one to get started.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
    
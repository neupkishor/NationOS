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
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";

type Organization = {
  id: string;
  name: string;
  regionId: string;
  location: string;
};

export default function OrganizationSetupPage() {
  const firestore = useFirestore();

  const organizationsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'organizations'));
  }, [firestore]);

  const { data: organizations, isLoading } = useCollection<Organization>(organizationsQuery);

  const regionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'regions'));
  }, [firestore]);
  
  const { data: regions } = useCollection<{id: string, name: string}>(regionsQuery);
  const regionMap = regions ? new Map(regions.map(r => [r.id, r.name])) : new Map();


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Organizations</h2>
          <p className="text-muted-foreground">
            Manage your organization hierarchy.
          </p>
        </div>
        <Button asChild>
          <Link href="/setup/organization/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Organization
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Loading organizations...</TableCell>
                </TableRow>
              )}
              {!isLoading && organizations?.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>{regionMap.get(org.regionId) || org.regionId}</TableCell>
                  <TableCell>{org.location}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/setup/organization/${org.id}/edit`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
               {!isLoading && organizations?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No organizations found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
    
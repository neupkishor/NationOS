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

type Organization = {
  id: string;
  name: string;
  regionId: string;
  location: string;
};

type Region = {
  id: string;
  name: string;
}

export default function OrganizationSetupPage() {
  const firestore = useFirestore();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const regionMap = regions ? new Map(regions.map(r => [r.id, r.name])) : new Map();

  useEffect(() => {
    if (!firestore) return;

    const fetchData = async () => {
      setIsLoading(true);
      // Fetch organizations
      const orgsQuery = query(collection(firestore, 'organizations'));
      const orgsSnapshot = await getDocs(orgsQuery);
      const fetchedOrgs = orgsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Organization[];
      setOrganizations(fetchedOrgs);

      // Fetch regions
      const regionsQuery = query(collection(firestore, 'regions'));
      const regionsSnapshot = await getDocs(regionsQuery);
      const fetchedRegions = regionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Region[];
      setRegions(fetchedRegions);
      
      setIsLoading(false);
    };

    fetchData();
  }, [firestore]);


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
    
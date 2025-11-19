
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
import { Badge } from "@/components/ui/badge";

type Infrastructure = {
  id: string;
  infrastructureType: string;
  location: string;
  status: string;
  nature: string;
  startDate: string;
};

export default function InfrastructurePage() {
  const firestore = useFirestore();
  const [infrastructure, setInfrastructure] = useState<Infrastructure[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!firestore) return;

    const fetchData = async () => {
      setIsLoading(true);
      const infraQuery = query(collection(firestore, 'infrastructures'));
      const infraSnapshot = await getDocs(infraQuery);
      const fetchedInfra = infraSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Infrastructure[];
      setInfrastructure(fetchedInfra);
      setIsLoading(false);
    };

    fetchData();
  }, [firestore]);


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Infrastructure</h2>
          <p className="text-muted-foreground">
            Manage infrastructure projects.
          </p>
        </div>
        <Button asChild>
          <Link href="/infrastructure/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Nature</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Loading projects...</TableCell>
                </TableRow>
              )}
              {!isLoading && infrastructure?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.infrastructureType}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.nature}</TableCell>
                   <TableCell>{item.startDate}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Built' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/infrastructure/${item.id}/edit`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
               {!isLoading && infrastructure?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No projects found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

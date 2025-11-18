'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, TrendingDown, Home } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

type Citizen = {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  citizenshipNumber: string;
  citizenshipType: string;
  currentLocation: string;
  location: string;
};

export default function CitizenRegistryPage() {
  const firestore = useFirestore();
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!firestore) return;

    const fetchCitizens = async () => {
      setIsLoading(true);
      const citizensQuery = query(collection(firestore, 'citizens'));
      const querySnapshot = await getDocs(citizensQuery);
      const fetchedCitizens = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Citizen[];
      setCitizens(fetchedCitizens);
      setIsLoading(false);
    };

    fetchCitizens();
  }, [firestore]);


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Citizen Registry</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registrations
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : citizens.length}</div>
            <p className="text-xs text-muted-foreground">
              National citizen database
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Births (This Year)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,345</div>
            <p className="text-xs text-muted-foreground">+2% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Deaths (This Year)
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-4,567</div>
            <p className="text-xs text-muted-foreground">-0.5% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Citizens Abroad
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89,123</div>
            <p className="text-xs text-muted-foreground">
              Based on residency status
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Citizen Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Citizenship No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Citizenship Type</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Loading citizen data...</TableCell>
                </TableRow>
              ) : citizens.map((citizen) => (
                <TableRow key={citizen.id}>
                  <TableCell className="font-medium">{citizen.citizenshipNumber}</TableCell>
                  <TableCell>{citizen.name}</TableCell>
                  <TableCell>{citizen.dateOfBirth}</TableCell>
                  <TableCell>{citizen.gender}</TableCell>
                  <TableCell>
                    <Badge
                      variant={'secondary'}
                    >
                      {citizen.citizenshipType.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{citizen.location}</TableCell>
                </TableRow>
              ))}
              {!isLoading && citizens.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={6} className="text-center">No citizen records found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

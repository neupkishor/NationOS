'use client';

import { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { doc, getDoc, collection, getDocs, query } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, User, BookUser, Briefcase, HeartCrack, Pencil } from 'lucide-react';

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
type Education = { id: string, degree: string, institution: string, graduationYear: string };
type Employment = { id: string, occupation: string, employmentStatus: string, salary: number };
type DeathRegistration = { id: string, dateOfDeath: string, placeOfDeath: string, causeOfDeath: string };


export default function CitizenDetailPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [employment, setEmployment] = useState<Employment[]>([]);
  const [death, setDeath] = useState<DeathRegistration | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!firestore || !params.id) return;

    const fetchAllData = async () => {
      setIsLoading(true);

      // Fetch citizen document
      const citizenRef = doc(firestore, 'citizens', params.id);
      const citizenSnap = await getDoc(citizenRef);
      if (citizenSnap.exists()) {
        setCitizen({ id: citizenSnap.id, ...citizenSnap.data() } as Citizen);
      }

      // Fetch education sub-collection
      const eduQuery = query(collection(firestore, `citizens/${params.id}/education`));
      const eduSnap = await getDocs(eduQuery);
      setEducation(eduSnap.docs.map(d => ({ id: d.id, ...d.data() } as Education)));
      
      // Fetch employment sub-collection
      const empQuery = query(collection(firestore, `citizens/${params.id}/employments`));
      const empSnap = await getDocs(empQuery);
      setEmployment(empSnap.docs.map(d => ({ id: d.id, ...d.data() } as Employment)));

      // Fetch death registration sub-collection
      const deathQuery = query(collection(firestore, `citizens/${params.id}/deathRegistrations`));
      const deathSnap = await getDocs(deathQuery);
      if (!deathSnap.empty) {
        const deathData = deathSnap.docs[0];
        setDeath({ id: deathData.id, ...deathData.data() } as DeathRegistration);
      }

      setIsLoading(false);
    };

    fetchAllData();
  }, [firestore, params.id]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!citizen) {
    return <div className="text-center p-8">Citizen not found.</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{citizen.name}</h2>
          <p className="text-muted-foreground">Citizen Profile</p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/citizens/${params.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" /> Edit Profile
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User /> Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Citizenship No:</strong> {citizen.citizenshipNumber}</p>
            <p><strong>Date of Birth:</strong> {citizen.dateOfBirth}</p>
            <p><strong>Gender:</strong> {citizen.gender}</p>
            <p><strong>Citizenship Type:</strong> <Badge variant="secondary">{citizen.citizenshipType.replace('_', ' ')}</Badge></p>
            <p><strong>Location:</strong> {citizen.location}</p>
            <p><strong>Current Location:</strong> {citizen.currentLocation}</p>
          </CardContent>
        </Card>
        
        {death && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive"><HeartCrack /> Deceased</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Date of Death:</strong> {death.dateOfDeath}</p>
              <p><strong>Place of Death:</strong> {death.placeOfDeath}</p>
              <p><strong>Cause of Death:</strong> {death.causeOfDeath}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
           <div>
            <CardTitle className="flex items-center gap-2"><BookUser /> Education History</CardTitle>
            <CardDescription>All recorded educational qualifications.</CardDescription>
           </div>
           <Button asChild>
             <Link href={`/entry/education?citizenId=${params.id}`}>Add Record</Link>
           </Button>
        </CardHeader>
        <CardContent>
          {education.length > 0 ? (
            <ul className="space-y-4">
              {education.map(edu => (
                <li key={edu.id} className="p-4 border rounded-md flex justify-between items-start">
                  <div>
                    <p className="font-bold">{edu.degree} - {edu.institution}</p>
                    <p className="text-sm text-muted-foreground">Graduated: {edu.graduationYear}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                      <Link href={`/citizens/${params.id}/education/${edu.id}/edit`}>Edit</Link>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No education records found.</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><Briefcase /> Employment History</CardTitle>
            <CardDescription>All recorded employment details.</CardDescription>
          </div>
          <Button asChild>
             <Link href={`/entry/occupation?citizenId=${params.id}`}>Add Record</Link>
          </Button>
        </CardHeader>
        <CardContent>
           {employment.length > 0 ? (
            <ul className="space-y-4">
              {employment.map(emp => (
                <li key={emp.id} className="p-4 border rounded-md flex justify-between items-start">
                   <div>
                    <p className="font-bold">{emp.occupation}</p>
                    <p className="text-sm text-muted-foreground">Status: {emp.employmentStatus} | Salary: ${emp.salary?.toLocaleString()}/month</p>
                  </div>
                   <Button variant="outline" size="sm" asChild>
                      <Link href={`/citizens/${params.id}/employment/${emp.id}/edit`}>Edit</Link>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No employment records found.</p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}

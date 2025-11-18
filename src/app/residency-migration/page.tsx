
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Globe, Plane, Shuffle, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useFirestore } from '@/firebase';
import { collectionGroup, getDocs, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const migrationData = [
  { year: '2020', internal: 12000, international: 4500 },
  { year: '2021', internal: 15000, international: 5200 },
  { year: '2022', internal: 13000, international: 6100 },
  { year: '2023', internal: 18000, international: 5800 },
  { year: '2024', internal: 22000, international: 7100 },
];

const chartConfig = {
  internal: { label: 'Internal Migration', color: 'hsl(var(--chart-1))' },
  international: { label: 'International Migration', color: 'hsl(var(--chart-2))' },
};

export default function ResidencyMigrationPage() {
  const firestore = useFirestore();
  const [totalMigrations, setTotalMigrations] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!firestore) return;

    const fetchMigrations = async () => {
      setIsLoading(true);
      const migrationQuery = query(collectionGroup(firestore, 'migrationHistories'));
      const querySnapshot = await getDocs(migrationQuery);
      setTotalMigrations(querySnapshot.size);
      setIsLoading(false);
    };
    
    fetchMigrations();
  }, [firestore]);


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">
        Residency & Migration Tracker
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Permanent Residents
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42.5M</div>
            <p className="text-xs text-muted-foreground">94% of total population</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Migrations
            </CardTitle>
            <Shuffle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : totalMigrations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total recorded movements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Internal Migration (YTD)
            </CardTitle>
            <Shuffle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22,000</div>
            <p className="text-xs text-muted-foreground">
              Movement between districts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Intl. Migration (YTD)
            </CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7,100</div>
            <p className="text-xs text-muted-foreground">Net inflow of people</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Migration Trends</CardTitle>
          <CardDescription>Year-over-year migration patterns.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <LineChart data={migrationData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `${value/1000}k`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="internal" stroke="var(--color-internal)" strokeWidth={2} />
              <Line type="monotone" dataKey="international" stroke="var(--color-international)" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

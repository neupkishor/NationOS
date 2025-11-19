
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
import { collection, collectionGroup, getDocs, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const chartConfig = {
  migrations: { label: 'Total Migrations', color: 'hsl(var(--chart-1))' },
};

type MigrationHistory = {
  migrationDate: string; // ISO string format
};

type Citizen = {
    id: string;
    location: string;
    currentLocation: string;
};

export default function ResidencyPage() {
  const firestore = useFirestore();
  const [totalMigrations, setTotalMigrations] = useState(0);
  const [migrationChartData, setMigrationChartData] = useState([]);
  const [permanentResidents, setPermanentResidents] = useState(0);
  const [totalPopulation, setTotalPopulation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!firestore) return;

    const fetchAllData = async () => {
      setIsLoading(true);

      // Fetch migrations
      const migrationQuery = query(collectionGroup(firestore, 'migrationHistories'));
      const migrationSnapshot = await getDocs(migrationQuery);
      const migrations = migrationSnapshot.docs.map(doc => doc.data() as MigrationHistory);
      
      setTotalMigrations(migrations.length);

      // Process migration data for the chart
      const currentYear = new Date().getFullYear();
      const yearlyCounts: { [year: string]: number } = {};
      for (let i = 0; i < 5; i++) {
        yearlyCounts[currentYear - i] = 0;
      }
      migrations.forEach(mig => {
        try {
          const year = new Date(mig.migrationDate).getFullYear();
          if (yearlyCounts[year] !== undefined) {
            yearlyCounts[year]++;
          }
        } catch (e) {
          console.error("Invalid migrationDate format:", mig.migrationDate);
        }
      });
      const formattedChartData = Object.entries(yearlyCounts)
        .map(([year, count]) => ({
          year: year,
          migrations: count,
        }))
        .sort((a, b) => parseInt(a.year) - parseInt(b.year));
      setMigrationChartData(formattedChartData as []);

      // Fetch citizens for permanent residency stats
      const citizensQuery = query(collection(firestore, 'citizens'));
      const citizensSnapshot = await getDocs(citizensQuery);
      const citizens = citizensSnapshot.docs.map(doc => doc.data() as Citizen);
      
      const population = citizens.length;
      setTotalPopulation(population);

      if (population > 0) {
        const permaResidentsCount = citizens.filter(c => c.location === c.currentLocation).length;
        setPermanentResidents(permaResidentsCount);
      }

      setIsLoading(false);
    };
    
    fetchAllData();
  }, [firestore]);

  const permanentResidentsPercentage = totalPopulation > 0 ? ((permanentResidents / totalPopulation) * 100).toFixed(1) : 0;


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">
        Residency & Migration
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
            <div className="text-2xl font-bold">{isLoading ? '...' : permanentResidents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{isLoading ? '...' : `${permanentResidentsPercentage}% of total population`}</p>
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
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">
              Data not available
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
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">
              Data not available
            </p>
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
            <LineChart data={migrationChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `${value/1000}k`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="migrations" stroke="var(--color-migrations)" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

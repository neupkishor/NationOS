
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

const chartConfig = {
  migrations: { label: 'Total Migrations', color: 'hsl(var(--chart-1))' },
};

type MigrationHistory = {
  migrationDate: string; // ISO string format
};

export default function ResidencyPage() {
  const firestore = useFirestore();
  const [totalMigrations, setTotalMigrations] = useState(0);
  const [migrationChartData, setMigrationChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!firestore) return;

    const fetchMigrations = async () => {
      setIsLoading(true);
      const migrationQuery = query(collectionGroup(firestore, 'migrationHistories'));
      const querySnapshot = await getDocs(migrationQuery);
      const migrations = querySnapshot.docs.map(doc => doc.data() as MigrationHistory);
      
      setTotalMigrations(migrations.length);

      // Process data for the chart
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

      setIsLoading(false);
    };
    
    fetchMigrations();
  }, [firestore]);


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

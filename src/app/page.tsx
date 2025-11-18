'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Briefcase,
  DollarSign,
  Users,
  Percent,
  BookOpenCheck,
  Baby,
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';
import { useFirestore } from '@/firebase';
import { collection, collectionGroup, getDocs, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

type Citizen = {
  id: string;
  dateOfBirth: string;
};

type Employment = {
  salary?: number;
  employmentStatus: string;
};

type Education = {
  nearbySchoolAccessDistance?: number;
};


const economicData = [
  { year: '2020', gdp: 2.1, unemployment: 5.8 },
  { year: '2021', gdp: 3.5, unemployment: 4.9 },
  { year: '2022', gdp: 4.2, unemployment: 4.1 },
  { year: '2023', gdp: 3.8, unemployment: 4.3 },
  { year: '2024', gdp: 4.5, unemployment: 3.9 },
];

const chartConfig = {
  population: {
    label: 'Population',
    color: 'hsl(var(--chart-1))',
  },
  gdp: {
    label: 'GDP Growth (%)',
    color: 'hsl(var(--chart-1))',
  },
  unemployment: {
    label: 'Unemployment (%)',
    color: 'hsl(var(--chart-2))',
  },
};

export default function DashboardPage() {
  const firestore = useFirestore();
  const [totalPopulation, setTotalPopulation] = useState(0);
  const [avgAnnualIncome, setAvgAnnualIncome] = useState(0);
  const [employmentRate, setEmploymentRate] = useState(0);
  const [childrenPercentage, setChildrenPercentage] = useState(0);
  const [educationAccess, setEducationAccess] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!firestore) return;

    const fetchData = async () => {
      setIsLoading(true);

      // Fetch citizens for population and children stats
      const citizensQuery = query(collection(firestore, 'citizens'));
      const citizensSnapshot = await getDocs(citizensQuery);
      const citizens = citizensSnapshot.docs.map(doc => doc.data() as Citizen);
      setTotalPopulation(citizensSnapshot.size);

      // Calculate children percentage
      if (citizens.length > 0) {
        const today = new Date();
        const under18 = citizens.filter(c => {
          const birthDate = new Date(c.dateOfBirth);
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          return age < 18;
        }).length;
        setChildrenPercentage((under18 / citizens.length) * 100);
      }

      // Fetch employments for income and employment rate
      const employmentsQuery = query(collectionGroup(firestore, 'employments'));
      const employmentsSnapshot = await getDocs(employmentsQuery);
      const employments = employmentsSnapshot.docs.map(doc => doc.data() as Employment);
      
      if (employments.length > 0) {
        const employed = employments.filter(e => e.employmentStatus === 'Employed');
        setEmploymentRate((employed.length / employments.length) * 100);
        
        const salaried = employments.filter(e => e.salary && e.salary > 0);
        if(salaried.length > 0) {
          const totalMonthlySalary = salaried.reduce((acc, e) => acc + (e.salary || 0), 0);
          const avgMonthlySalary = totalMonthlySalary / salaried.length;
          setAvgAnnualIncome(avgMonthlySalary * 12);
        }
      }

      // Fetch education for access stats
      const educationQuery = query(collectionGroup(firestore, 'education'));
      const educationSnapshot = await getDocs(educationQuery);
      const educations = educationSnapshot.docs.map(doc => doc.data() as Education);

      if (educations.length > 0) {
        const withAccess = educations.filter(e => e.nearbySchoolAccessDistance !== undefined && e.nearbySchoolAccessDistance <= 1).length;
        setEducationAccess((withAccess / educations.length) * 100);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [firestore]);

  const formatCurrency = (value: number) => {
     if (value >= 1_000_000_000_000) {
      return `$${(value / 1_000_000_000_000).toFixed(1)}T`;
    }
    if (value >= 1_000_000_000) {
        return `$${(value / 1_000_000_000).toFixed(1)}B`;
    }
    if (value >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(1)}K`;
    }
    return `$${value.toFixed(2)}`;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Population</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : totalPopulation.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Live data from database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Annual Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : formatCurrency(avgAnnualIncome)}</div>
            <p className="text-xs text-muted-foreground">Calculated from employment data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employment Rate</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : `${employmentRate.toFixed(1)}%`}</div>
            <p className="text-xs text-muted-foreground">Live data from database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Children (Under 18)</CardTitle>
            <Baby className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : `${childrenPercentage.toFixed(1)}%`}</div>
            <p className="text-xs text-muted-foreground">Of total population</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">School Access (&lt;1km)</CardTitle>
            <BookOpenCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : `${educationAccess.toFixed(1)}%`}</div>
            <p className="text-xs text-muted-foreground">Live education data</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Population Growth</CardTitle>
            <CardContent className="text-sm text-muted-foreground">Static demo data</CardContent>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart
                accessibilityLayer
                data={[{ month: 'Jan', population: 186 }, { month: 'Feb', population: 305 }, { month: 'Mar', population: 237 }, { month: 'Apr', population: 278 }, { month: 'May', population: 189 }, { month: 'Jun', population: 239 }]}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="population" fill="var(--color-population)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle>Economic Indicators</CardTitle>
             <CardContent className="text-sm text-muted-foreground">Static demo data</CardContent>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart accessibilityLayer data={economicData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis yAxisId="left" orientation="left" tickFormatter={(v) => `${v}%`} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line dataKey="gdp" type="monotone" stroke="var(--color-gdp)" strokeWidth={2} dot={true} yAxisId="left" name="GDP Growth" />
                <Line dataKey="unemployment" type="monotone" stroke="var(--color-unemployment)" strokeWidth={2} dot={true} yAxisId="right" name="Unemployment" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

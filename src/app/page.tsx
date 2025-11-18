
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Briefcase,
  DollarSign,
  Users,
  BookOpenCheck,
  Baby,
  PersonStanding,
  Cake,
  Banknote,
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
  gender: 'male' | 'female' | 'other';
};

type Employment = {
  salary?: number;
  employmentStatus: string;
};

type Education = {
  nearbySchoolAccessDistance?: number;
};

const chartConfig = {
  population: {
    label: 'Population',
    color: 'hsl(var(--chart-1))',
  },
  count: {
    label: 'Count',
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

const getAge = (dateString: string) => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const calculateMedian = (numbers: number[]) => {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;

export default function DashboardPage() {
  const firestore = useFirestore();
  const [totalPopulation, setTotalPopulation] = useState(0);
  const [avgAnnualIncome, setAvgAnnualIncome] = useState(0);
  const [employmentRate, setEmploymentRate] = useState(0);
  const [childrenPercentage, setChildrenPercentage] = useState(0);
  const [educationAccess, setEducationAccess] = useState(0);
  const [maleFemaleRatio, setMaleFemaleRatio] = useState('N/A');
  const [childAdultRatio, setChildAdultRatio] = useState('N/A');
  const [medianAge, setMedianAge] = useState(0);
  const [medianIncome, setMedianIncome] = useState(0);
  const [ageDistribution, setAgeDistribution] = useState([]);
  const [incomeDistribution, setIncomeDistribution] = useState([]);
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

      // Calculate age-related stats
      if (citizens.length > 0) {
        const ages = citizens.map(c => getAge(c.dateOfBirth));
        setMedianAge(calculateMedian(ages));

        const ageGroups = [
          { name: '0-17', count: ages.filter(age => age <= 17).length },
          { name: '18-35', count: ages.filter(age => age >= 18 && age <= 35).length },
          { name: '36-55', count: ages.filter(age => age >= 36 && age <= 55).length },
          { name: '56+', count: ages.filter(age => age > 55).length },
        ];
        setAgeDistribution(ageGroups as []);
        
        const under18 = ageGroups[0].count;
        setChildrenPercentage((under18 / citizens.length) * 100);

        const adults = citizens.length - under18;
        const ageDivisor = gcd(under18, adults);
        setChildAdultRatio(`${(under18 / ageDivisor).toFixed(0)} : ${(adults / ageDivisor).toFixed(0)}`);
        
        const males = citizens.filter(c => c.gender === 'male').length;
        const females = citizens.filter(c => c.gender === 'female').length;
        if (males > 0 || females > 0) {
          const genderDivisor = gcd(males, females);
          setMaleFemaleRatio(`${(males / genderDivisor).toFixed(0)} : ${(females / genderDivisor).toFixed(0)}`);
        }
      }

      // Fetch employments for income and employment rate
      const employmentsQuery = query(collectionGroup(firestore, 'employments'));
      const employmentsSnapshot = await getDocs(employmentsQuery);
      const employments = employmentsSnapshot.docs.map(doc => doc.data() as Employment);
      
      if (employments.length > 0) {
        const employed = employments.filter(e => e.employmentStatus === 'Employed');
        setEmploymentRate((employed.length / employments.length) * 100);
        
        const salaried = employments.filter(e => e.salary && e.salary > 0).map(e => e.salary as number);
        if(salaried.length > 0) {
          const totalMonthlySalary = salaried.reduce((acc, salary) => acc + salary, 0);
          const avgMonthlySalary = totalMonthlySalary / salaried.length;
          setAvgAnnualIncome(avgMonthlySalary * 12);
          setMedianIncome(calculateMedian(salaried));

          const incomeGroups = [
             { name: '<2k', count: salaried.filter(s => s < 2000).length },
             { name: '2k-4k', count: salaried.filter(s => s >= 2000 && s < 4000).length },
             { name: '4k-6k', count: salaried.filter(s => s >= 4000 && s < 6000).length },
             { name: '>6k', count: salaried.filter(s => s >= 6000).length },
          ];
          setIncomeDistribution(incomeGroups as []);
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
    return `$${value.toFixed(0)}`;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">School Access (&lt;1km)</CardTitle>
            <BookOpenCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : `${educationAccess.toFixed(1)}%`}</div>
            <p className="text-xs text-muted-foreground">Live education data</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Male : Female Ratio</CardTitle>
            <PersonStanding className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : maleFemaleRatio}</div>
            <p className="text-xs text-muted-foreground">From citizen gender data</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Children : Adult Ratio</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : childAdultRatio}</div>
            <p className="text-xs text-muted-foreground">Under 18 vs. 18 and over</p>
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
            <CardTitle className="text-sm font-medium">Median Age</CardTitle>
            <Cake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : medianAge.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Median age of population</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Median Monthly Income</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : formatCurrency(medianIncome)}</div>
            <p className="text-xs text-muted-foreground">Median of all salaried employees</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart
                accessibilityLayer
                data={ageDistribution}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Income Distribution (Monthly)</CardTitle>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart
                accessibilityLayer
                data={incomeDistribution}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

    
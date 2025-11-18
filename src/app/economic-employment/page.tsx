'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Briefcase, DollarSign, Users, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';

const incomeData = [
  { name: 'Low Income', value: 400, color: 'hsl(var(--chart-1))' },
  { name: 'Mid Income', value: 300, color: 'hsl(var(--chart-2))' },
  { name: 'High Income', value: 200, color: 'hsl(var(--chart-3))' },
];

const skillsData = [
  { name: 'Technology', value: 25, color: 'hsl(var(--chart-1))' },
  { name: 'Healthcare', value: 20, color: 'hsl(var(--chart-2))' },
  { name: 'Agriculture', value: 30, color: 'hsl(var(--chart-3))' },
  { name: 'Services', value: 15, color: 'hsl(var(--chart-4))' },
  { name: 'Other', value: 10, color: 'hsl(var(--chart-5))' },
];

const chartConfig = {
  value: {
    label: 'Value',
  },
  income: {
    label: 'Income',
  },
  skills: {
    label: 'Skills',
  },
};


export default function EconomicEmploymentPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">
        Economic & Employment
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Median Household Income
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unemployment Rate
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.9%</div>
            <p className="text-xs text-muted-foreground">-0.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Labor Force
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25.8M</div>
            <p className="text-xs text-muted-foreground">
              Total active workers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Jobs Created
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+120k</div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Household Income Distribution</CardTitle>
          </CardHeader>
          <CardContent>
             <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="name" hideLabel />}
                />
                <Pie
                  data={incomeData}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                  nameKey="name"
                >
                  {incomeData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Skills Distribution</CardTitle>
          </CardHeader>
          <CardContent>
             <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="name" hideLabel />}
                />
                <Pie
                  data={skillsData}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                  nameKey="name"
                >
                  {skillsData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
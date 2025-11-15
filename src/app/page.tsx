import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Briefcase,
  DollarSign,
  Tractor,
  Users,
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

const populationData = [
  { month: 'Jan', population: 18600 },
  { month: 'Feb', population: 30500 },
  { month: 'Mar', population: 23700 },
  { month: 'Apr', population: 27800 },
  { month: 'May', population: 18900 },
  { month: 'Jun', population: 23900 },
];

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
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Population
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231,890</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              GDP (Annual)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.3 Trillion</div>
            <p className="text-xs text-muted-foreground">
              +4.5% from last year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Agricultural Output
            </CardTitle>
            <Tractor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125M Metric Tons</div>
            <p className="text-xs text-muted-foreground">
              +12% from last year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Literacy Rate
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.5%</div>
            <p className="text-xs text-muted-foreground">
              +0.5% from last year
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Population Growth Overview (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart
                accessibilityLayer
                data={populationData}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={(value) => (value / 1000) + 'k'}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="population"
                  fill="var(--color-population)"
                  radius={8}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle>Economic Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart
                accessibilityLayer
                data={economicData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line
                  dataKey="gdp"
                  type="monotone"
                  stroke="var(--color-gdp)"
                  strokeWidth={2}
                  dot={true}
                  yAxisId="left"
                  name="GDP Growth"
                />
                <Line
                  dataKey="unemployment"
                  type="monotone"
                  stroke="var(--color-unemployment)"
                  strokeWidth={2}
                  dot={true}
                  yAxisId="right"
                  name="Unemployment"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

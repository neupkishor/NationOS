'use client';

import { GenerateCustomReportOutput } from '@/ai/flows/generate-custom-report';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { BarChart, FileText, LineChart, Map, Table } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart as RechartsBarChart,
} from 'recharts';
import { Separator } from './ui/separator';

interface ReportDisplayProps {
  report?: GenerateCustomReportOutput;
}

const chartConfig = {
  data: {
    label: 'Value',
    color: 'hsl(var(--chart-1))',
  },
};

const dummyData = [
  { name: 'Category A', value: 4000 },
  { name: 'Category B', value: 3000 },
  { name: 'Category C', value: 2000 },
  { name: 'Category D', value: 2780 },
  { name: 'Category E', value: 1890 },
];

export default function ReportDisplay({ report }: ReportDisplayProps) {
  if (!report) {
    return (
      <Card className="h-full flex flex-col items-center justify-center text-center">
        <CardHeader>
          <div className="mx-auto bg-secondary p-4 rounded-full">
            <FileText className="w-12 h-12 text-muted-foreground" />
          </div>
          <CardTitle className="mt-4">Your report will be displayed here</CardTitle>
          <CardDescription>
            Fill out the form and click "Generate Report" to see the results.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const renderVisualization = (viz: string) => {
    const vizLower = viz.toLowerCase();
    if (vizLower.includes('bar chart')) {
      return <BarChart className="w-8 h-8 mr-4 text-primary" />;
    }
    if (vizLower.includes('line chart')) {
      return <LineChart className="w-8 h-8 mr-4 text-primary" />;
    }
    if (vizLower.includes('map')) {
      return <Map className="w-8 h-8 mr-4 text-primary" />;
    }
    if (vizLower.includes('table')) {
      return <Table className="w-8 h-8 mr-4 text-primary" />;
    }
    return <BarChart className="w-8 h-8 mr-4 text-primary" />;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-2xl">{report.reportTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Key Insights Summary</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {report.reportSummary}
          </p>
        </div>

        {report.reportDetails && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold">Detailed Analysis</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {report.reportDetails}
              </p>
            </div>
          </>
        )}

        {report.visualizations && report.visualizations.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold">Suggested Visualizations</h3>
              <div className="mt-4 space-y-4">
                {report.visualizations.map((viz, index) => (
                  <Card key={index} className="bg-background/50">
                    <CardHeader className="flex flex-row items-center">
                      {renderVisualization(viz)}
                      <CardTitle className="text-base">{viz}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={chartConfig}
                        className="h-[250px] w-full"
                      >
                        <RechartsBarChart
                          accessibilityLayer
                          data={dummyData}
                          layout="vertical"
                          margin={{ left: 10 }}
                        >
                          <CartesianGrid horizontal={false} />
                          <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                          />
                          <XAxis dataKey="value" type="number" hide />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                          />
                          <Bar
                            dataKey="value"
                            fill="var(--color-data)"
                            radius={5}
                          />
                        </RechartsBarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

'use client';

import { useFormState } from 'react-dom';
import { handleGenerateReport } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  DATA_CATEGORIES,
  GEOGRAPHIC_REGIONS,
  TIME_PERIODS,
} from '@/lib/constants';
import { useEffect, useRef } from 'react';
import ReportDisplay from './report-display';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import SubmitButton from './submit-button';

const initialState = {
  message: '',
};

export default function ReportGenerator() {
  const [state, formAction] = useFormState(handleGenerateReport, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <form ref={formRef} action={formAction}>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="geographicRegion">Geographic Region</Label>
                <Select name="geographicRegion" required>
                  <SelectTrigger id="geographicRegion">
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    {GEOGRAPHIC_REGIONS.map((region) => (
                      <SelectItem key={region} value={region.toLowerCase()}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timePeriod">Time Period</Label>
                <Select name="timePeriod" required>
                  <SelectTrigger id="timePeriod">
                    <SelectValue placeholder="Select a time period" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_PERIODS.map((period) => (
                      <SelectItem key={period} value={period.toLowerCase()}>
                        {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Data Categories</Label>
                <div className="grid grid-cols-2 gap-2">
                  {DATA_CATEGORIES.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        name="dataCategories"
                        value={category.label}
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-normal"
                      >
                        {category.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Report Type</Label>
                <RadioGroup defaultValue="summary" name="reportType" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="summary" id="r1" />
                    <Label htmlFor="r1">Summary</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="detailed" id="r2" />
                    <Label htmlFor="r2">Detailed</Label>
                  </div>
                </RadioGroup>
              </div>


              <div className="space-y-2">
                <Label htmlFor="additionalContext">Additional Context</Label>
                <Textarea
                  id="additionalContext"
                  name="additionalContext"
                  placeholder="e.g., focus on youth unemployment, compare with previous year..."
                />
              </div>
              
              <SubmitButton />
            </CardContent>
          </Card>
        </form>
      </div>

      <div className="lg:col-span-2">
        <ReportDisplay report={state.report} />
      </div>
    </div>
  );
}

'use server';

import { generateCustomReport, GenerateCustomReportInput, GenerateCustomReportOutput } from "@/ai/flows/generate-custom-report";
import { z } from "zod";

const ReportSchema = z.object({
  geographicRegion: z.string().min(1, "Geographic region is required."),
  timePeriod: z.string().min(1, "Time period is required."),
  dataCategories: z.array(z.string()).min(1, "At least one data category is required."),
  reportType: z.enum(["summary", "detailed"]),
  additionalContext: z.string().optional(),
});

type ReportState = {
  message?: string;
  report?: GenerateCustomReportOutput;
  error?: boolean;
}

export async function handleGenerateReport(
  prevState: ReportState,
  formData: FormData
): Promise<ReportState> {
  
  const validatedFields = ReportSchema.safeParse({
    geographicRegion: formData.get('geographicRegion'),
    timePeriod: formData.get('timePeriod'),
    dataCategories: formData.getAll('dataCategories'),
    reportType: formData.get('reportType'),
    additionalContext: formData.get('additionalContext'),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid form data. Please check your inputs.",
      error: true,
    };
  }

  try {
    const reportData = await generateCustomReport(validatedFields.data as GenerateCustomReportInput);
    return {
      message: "Report generated successfully.",
      report: reportData,
    };
  } catch (e) {
    console.error(e);
    return {
      message: "Failed to generate report. Please try again later.",
      error: true,
    };
  }
}

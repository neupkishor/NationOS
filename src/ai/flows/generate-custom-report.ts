// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview A Genkit flow for generating custom reports based on specified parameters.
 *
 * - generateCustomReport - A function that generates a custom report.
 * - GenerateCustomReportInput - The input type for the generateCustomReport function.
 * - GenerateCustomReportOutput - The return type for the generateCustomReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCustomReportInputSchema = z.object({
  geographicRegion: z
    .string()
    .describe('The geographic region for the report (e.g., ward, municipality, district, province).'),
  timePeriod: z.string().describe('The time period for the report (e.g., yearly, quarterly, real-time).'),
  dataCategories: z
    .array(z.string())
    .describe(
      'An array of data categories to include in the report (e.g., population data, employment data, agricultural production).' 
    ),
  reportType: z.enum(['summary', 'detailed']).default('summary').describe('Type of report to generate.'),
  additionalContext: z.string().optional().describe('Any additional context or specific requirements for the report.'),
});

export type GenerateCustomReportInput = z.infer<typeof GenerateCustomReportInputSchema>;

const GenerateCustomReportOutputSchema = z.object({
  reportTitle: z.string().describe('The title of the generated report.'),
  reportSummary: z.string().describe('A summary of the key insights from the report.'),
  reportDetails: z.string().optional().describe('Detailed information and analysis in the report, if requested.'),
  visualizations: z.array(z.string()).optional().describe('A list of URLs or data URIs for charts, maps, and tables.'),
});

export type GenerateCustomReportOutput = z.infer<typeof GenerateCustomReportOutputSchema>;

export async function generateCustomReport(input: GenerateCustomReportInput): Promise<GenerateCustomReportOutput> {
  return generateCustomReportFlow(input);
}

const generateReportPrompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: {schema: GenerateCustomReportInputSchema},
  output: {schema: GenerateCustomReportOutputSchema},
  prompt: `You are a government data analyst tasked with generating custom reports based on specified parameters.

  The user will provide the geographic region, time period, and data categories to include in the report, as well as the report type.

  Based on this information, generate a comprehensive report that includes a title, summary of key insights, detailed information and analysis (if requested), and suggestions for visualizations to include.

  Geographic Region: {{{geographicRegion}}}
  Time Period: {{{timePeriod}}}
  Data Categories: {{#each dataCategories}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Report Type: {{{reportType}}}
  Additional Context: {{{additionalContext}}}
  
  Consider the following when creating the report:
  - Provide actionable insights and recommendations based on the data.
  - Suggest relevant visualizations to support the report's findings (e.g., charts, maps, tables).
  - Tailor the report's content and level of detail to the specified report type (summary or detailed).
`,
});

const generateCustomReportFlow = ai.defineFlow(
  {
    name: 'generateCustomReportFlow',
    inputSchema: GenerateCustomReportInputSchema,
    outputSchema: GenerateCustomReportOutputSchema,
  },
  async input => {
    const {output} = await generateReportPrompt(input);
    return output!;
  }
);

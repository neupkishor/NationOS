import ReportGenerator from "@/components/report-generator";

export default function ReportPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Smart Reporting Engine</h1>
        <p className="text-muted-foreground">
          Generate custom reports using AI. Select your parameters below.
        </p>
      </div>
      <ReportGenerator />
    </div>
  );
}

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SetupPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Setup</CardTitle>
          <CardDescription>System setup and configuration.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the main setup page.</p>
        </CardContent>
      </Card>
    </div>
  );
}

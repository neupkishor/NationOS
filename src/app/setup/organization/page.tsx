import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function OrganizationSetupPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Setup</CardTitle>
          <CardDescription>Configure your organization details here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Organization setup form will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

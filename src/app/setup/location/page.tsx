import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function LocationSetupPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Location Setup</CardTitle>
          <CardDescription>Configure locations for your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Location setup form will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

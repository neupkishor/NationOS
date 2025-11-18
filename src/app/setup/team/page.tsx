import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function TeamSetupPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Setup</CardTitle>
          <CardDescription>Manage your teams and team members.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Team setup form will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

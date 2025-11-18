import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function CitizenSetupPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Citizen Setup</CardTitle>
          <CardDescription>Add and manage citizen records.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Citizen setup form will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

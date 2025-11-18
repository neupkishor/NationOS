import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function FamilySetupPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Family Setup</CardTitle>
          <CardDescription>Set up and manage family units.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Family setup form will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

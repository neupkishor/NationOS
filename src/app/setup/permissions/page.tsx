import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function PermissionsSetupPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Permissions Setup</CardTitle>
          <CardDescription>Manage user roles and permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Permissions setup form will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

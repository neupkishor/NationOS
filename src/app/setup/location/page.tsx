
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function LocationSetupPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Location Setup</CardTitle>
          <CardDescription>This page has been moved to /setup/region.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please update your bookmarks.</p>
        </CardContent>
      </Card>
    </div>
  );
}

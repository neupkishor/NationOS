
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrganizationDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>Viewing details for organization ID: {params.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Organization details will be displayed here.</p>
           <Button asChild className="mt-4">
              <Link href={`/setup/organization/${params.id}/edit`}>Edit Details</Link>
           </Button>
        </CardContent>
      </Card>
    </div>
  );
}


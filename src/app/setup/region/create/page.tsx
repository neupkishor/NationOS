
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreateRegionPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Region</CardTitle>
          <CardDescription>Fill out the details to add a new region.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="region-name">Region Name</Label>
              <Input id="region-name" placeholder="e.g., District B" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region-type">Region Type</Label>
              <Input id="region-type" placeholder="e.g., District, Ward" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" asChild>
                <Link href="/setup/region">Cancel</Link>
              </Button>
              <Button>Create Region</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

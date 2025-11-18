
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function CreateOrganizationPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Organization</CardTitle>
          <CardDescription>Fill out the details to add a new organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input id="org-name" placeholder="e.g., Ministry of Health" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select name="region">
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national">National</SelectItem>
                  <SelectItem value="district-a">District A</SelectItem>
                  <SelectItem value="province-b">Province B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
               <Select name="location">
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="capital-city">Capital City</SelectItem>
                  <SelectItem value="townsville">Townsville</SelectItem>
                  <SelectItem value="village-green">Village Green</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
               <Button variant="outline" asChild>
                <Link href="/setup/organization">Cancel</Link>
              </Button>
              <Button>Create Organization</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

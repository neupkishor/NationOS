import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building, MapPin, Users2, Shield } from "lucide-react";

const setupSections = [
  { href: "/setup/organization", icon: Building, title: "Organization", description: "Configure your organization details." },
  { href: "/setup/location", icon: MapPin, title: "Location", description: "Set up wards, districts, and regions." },
  { href: "/setup/team", icon: Users2, title: "Team", description: "Manage users and team members." },
  { href: "/setup/permissions", icon: Shield, title: "Permissions", description: "Define roles and access levels." },
];

export default function SetupPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">System Setup</h2>
        <p className="text-muted-foreground">
          Configure and manage your NationOS instance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {setupSections.map((section) => (
          <Card key={section.href}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className='p-2 bg-secondary rounded-md'>
                  <section.icon className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle>{section.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">{section.description}</p>
              <Button asChild variant="outline">
                <Link href={section.href}>Go to {section.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

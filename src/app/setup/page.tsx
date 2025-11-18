
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Building, MapPin, Users2, Shield, ChevronRight } from "lucide-react";

const setupSections = [
  { href: "/setup/organization", icon: Building, title: "Organization", description: "Configure your organization details." },
  { href: "/setup/region", icon: MapPin, title: "Region", description: "Set up wards, districts, and regions." },
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

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {setupSections.map((section) => (
              <li key={section.href}>
                <Link href={section.href} className="block hover:bg-muted/50">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className='p-2 bg-secondary rounded-md'>
                        <section.icon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">{section.title}</p>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

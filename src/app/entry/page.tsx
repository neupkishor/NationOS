

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Users2, ChevronRight, BookUser, Briefcase, HeartCrack, Globe } from "lucide-react";

const entrySections = [
  { href: "/entry/citizen", icon: Users2, title: "Citizen Entry", description: "Add a new citizen record to the database." },
  { href: "/entry/death-registration", icon: HeartCrack, title: "Death Registration", description: "Record a citizen's death." },
  { href: "/entry/education", icon: BookUser, title: "Education Record", description: "Add educational qualifications for a citizen." },
  { href: "/entry/occupation", icon: Briefcase, title: "Occupation Record", description: "Add employment details for a citizen." },
  { href: "/entry/residency", icon: Globe, title: "Residency Entry", description: "Update a citizen's current residency." },
];

export default function EntryPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Data Entry</h2>
        <p className="text-muted-foreground">
          Select a category to enter new data.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {entrySections.map((section) => (
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

    

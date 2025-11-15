import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { HardHat, School, Hospital, Droplets, Zap, Wifi } from 'lucide-react';

const infrastructure = [
  {
    name: 'Road Network',
    status: 85,
    description: 'Paved and accessible',
    icon: HardHat,
  },
  {
    name: 'Schools',
    status: 92,
    description: 'Operational and staffed',
    icon: School,
  },
  {
    name: 'Hospitals & Clinics',
    status: 78,
    description: 'Accessible healthcare facilities',
    icon: Hospital,
  },
  {
    name: 'Clean Water Supply',
    status: 88,
    description: 'Coverage for households',
    icon: Droplets,
  },
  {
    name: 'Electricity Coverage',
    status: 95,
    description: 'Access to national grid',
    icon: Zap,
  },
  {
    name: 'Internet Penetration',
    status: 65,
    description: 'Broadband and mobile access',
    icon: Wifi,
  },
];

export default function InfrastructurePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Infrastructure & Resources
        </h2>
        <p className="text-muted-foreground">
          Tracking the status of key national infrastructure.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {infrastructure.map((item) => (
          <Card key={item.name}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-2">
                <CardTitle className="text-base font-medium">
                  {item.name}
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </div>
              <div className='p-2 bg-secondary rounded-md'>
                <item.icon className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Progress value={item.status} className="h-2" />
                <span className="text-lg font-bold">{item.status}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Completion / Coverage</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

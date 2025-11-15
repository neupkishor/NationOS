import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, TrendingDown, Home } from 'lucide-react';

const citizens = [
  {
    id: 'USR-001',
    name: 'John Doe',
    age: 34,
    residency: 'Permanent',
    location: 'District A, Ward 5',
  },
  {
    id: 'USR-002',
    name: 'Jane Smith',
    age: 28,
    residency: 'Permanent',
    location: 'District B, Ward 2',
  },
  {
    id: 'USR-003',
    name: 'Sam Wilson',
    age: 45,
    residency: 'Temporary',
    location: 'Abroad',
  },
  {
    id: 'USR-004',
    name: 'Emily Johnson',
    age: 19,
    residency: 'Permanent',
    location: 'District A, Ward 3',
  },
  {
    id: 'USR-005',
    name: 'Michael Brown',
    age: 62,
    residency: 'Permanent',
    location: 'District C, Ward 1',
  },
];

export default function CitizenRegistryPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Citizen Registry</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registrations
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234,567</div>
            <p className="text-xs text-muted-foreground">
              National citizen database
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Births (This Year)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,345</div>
            <p className="text-xs text-muted-foreground">+2% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Deaths (This Year)
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-4,567</div>
            <p className="text-xs text-muted-foreground">-0.5% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Citizens Abroad
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89,123</div>
            <p className="text-xs text-muted-foreground">
              Based on residency status
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Residency</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {citizens.map((citizen) => (
                <TableRow key={citizen.id}>
                  <TableCell className="font-medium">{citizen.id}</TableCell>
                  <TableCell>{citizen.name}</TableCell>
                  <TableCell>{citizen.age}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        citizen.residency === 'Permanent'
                          ? 'default'
                          : 'secondary'
                      }
                      className={citizen.residency === 'Permanent' ? 'bg-primary/80' : ''}
                    >
                      {citizen.residency}
                    </Badge>
                  </TableCell>
                  <TableCell>{citizen.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

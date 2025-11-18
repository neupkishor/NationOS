import {
  Briefcase,
  HardHat,
  Home,
  LineChart,
  Settings,
  Tractor,
  Users,
  Wallet,
} from 'lucide-react';

export const NAV_LINKS = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/report', label: 'Smart Reporting', icon: LineChart },
  { href: '/citizen-registry', label: 'Citizen Registry', icon: Users },
  { href: '/economic-employment', label: 'Economic & Employment', icon: Briefcase },
  { href: '/agriculture', label: 'Agriculture', icon: Tractor },
  { href: '/residency-migration', label: 'Residency & Migration', icon: Wallet },
  { href: '/infrastructure-resources', label: 'Infrastructure', icon: HardHat },
];

export const FOOTER_LINKS = [
    { href: '/setup', label: 'Settings', icon: Settings },
]

export const DATA_CATEGORIES = [
  { id: 'population', label: 'Population Data' },
  { id: 'employment', label: 'Employment & Economic' },
  { id: 'birthDeath', label: 'Birth/Death Registrations' },
  { id: 'family', label: 'Family Composition' },
  { id: 'residency', label: 'Residence Location' },
  { id: 'agriculture', label: 'Agricultural Production' },
  { id: 'livestock', label: 'Livestock Count' },
  { id: 'income', label: 'Income & Spending' },
  { id: 'business', label: 'Local Business Activity' },
  { id: 'infrastructure', label: 'Infrastructure Status' },
];

export const GEOGRAPHIC_REGIONS = [
  'Ward',
  'Municipality',
  'District',
  'Province',
  'National',
];

export const TIME_PERIODS = ['Real-time', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

import {
  Briefcase,
  HardHat,
  Home,
  LineChart,
  Settings,
  Tractor,
  Users,
  Wallet,
  Globe,
  Database,
  Building,
  MapPin,
  Users2,
  Shield,
} from 'lucide-react';

export const NAV_LINKS = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/citizen-registry', label: 'Citizen Registry', icon: Users },
  { href: '/report', label: 'Smart Reporting', icon: LineChart },
  { href: '/economic-employment', label: 'Economic', icon: Briefcase },
  { href: '/agriculture', label: 'Agriculture', icon: Tractor },
  { href: '/residency-migration', label: 'Residency', icon: Wallet },
  { href: '/infrastructure-resources', label: 'Infrastructure', icon: HardHat },
];

export const SYSTEM_LINKS = [
  { href: '/setup', label: 'Setup', icon: Settings },
];

export const FOOTER_LINKS = [
]

export const GEOGRAPHIC_REGIONS = ['Ward', 'Municipality', 'District', 'Province', 'National'];

export const TIME_PERIODS = ['Real-time', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

export const DATA_CATEGORIES = [
  { id: 'population', label: 'Population Data' },
  { id: 'employment', label: 'Employment Data' },
  { id: 'agriculture', label: 'Agricultural Production' },
  { id: 'household_income', label: 'Household Income' },
  { id: 'migration', label: 'Migration Patterns' },
  { id: 'infrastructure', label: 'Infrastructure Status' },
];

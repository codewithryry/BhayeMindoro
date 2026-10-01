import { Calculator, Flag, House, MapPin, Route, type LucideIcon } from 'lucide-react';

export type NavItem = {
  to: string;
  label: string;
  /** Shorter label for the mobile bottom bar. */
  short: string;
  icon: LucideIcon;
};

/** Single navigation definition for the desktop sidebar and the mobile bottom bar. */
export const NAV_ITEMS: readonly NavItem[] = [
  { to: '/', label: 'Dashboard', short: 'Home', icon: House },
  { to: '/ruta', label: 'Hanap Ruta', short: 'Ruta', icon: Route },
  { to: '/tricycle', label: 'Tricycle Calculator', short: 'Tricycle', icon: Calculator },
  { to: '/terminals', label: 'Mga Terminal', short: 'Terminal', icon: MapPin },
  { to: '/report', label: 'Report Fare Concern', short: 'Report', icon: Flag },
];

/** The bottom bar's raised centre button. */
export const CENTER_ITEM = NAV_ITEMS[2];

export const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/ruta': 'Hanap Ruta',
  '/tricycle': 'Tricycle Calculator',
  '/terminals': 'Mga Terminal',
  '/report': 'Report Fare Concern',
  '/account': 'Account',
};

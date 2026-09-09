import {
  Home,
  Hammer,
  Utensils,
  Car,
  HeartPulse,
  Sparkles,
  Briefcase,
  PawPrint,
  Store,
  type LucideIcon,
} from "lucide-react";

/** Maps `categories.icon` (set from scripts/seed.ts / admin) to a Lucide
 * icon. Unrecognized/missing values fall back to a generic storefront icon
 * so a newly-created category never breaks the UI. */
const ICONS: Record<string, LucideIcon> = {
  home: Home,
  hammer: Hammer,
  utensils: Utensils,
  car: Car,
  "heart-pulse": HeartPulse,
  sparkles: Sparkles,
  briefcase: Briefcase,
  "paw-print": PawPrint,
};

export function getCategoryIcon(icon?: string | null): LucideIcon {
  return (icon && ICONS[icon]) || Store;
}

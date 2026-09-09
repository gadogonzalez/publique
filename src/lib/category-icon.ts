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

const PALETTE = [
  { bg: "bg-emerald-100", fg: "text-emerald-700" },
  { bg: "bg-amber-100", fg: "text-amber-700" },
  { bg: "bg-sky-100", fg: "text-sky-700" },
  { bg: "bg-rose-100", fg: "text-rose-700" },
  { bg: "bg-orange-100", fg: "text-orange-700" },
  { bg: "bg-violet-100", fg: "text-violet-700" },
  { bg: "bg-teal-100", fg: "text-teal-700" },
  { bg: "bg-stone-200", fg: "text-stone-700" },
];

/** Deterministic soft color per category (or business, as a fallback key)
 * so the same key always renders the same tile color across the app,
 * without hand-maintaining a color per category. */
export function getCategoryColor(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length]!;
}

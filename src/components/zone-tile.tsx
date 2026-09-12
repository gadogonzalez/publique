import Link from "next/link";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Location } from "@/lib/types/database";

/** Large-typography location tile -- editorial, not a tiny inline link row
 * or a chip. Alternates dark/muted so the zone row itself has rhythm. */
export function ZoneTile({ locality, index }: { locality: Location; index: number }) {
  const dark = index % 3 === 1;
  return (
    <Link
      href={`/buscar?zona=${locality.id}`}
      className={cn(
        "group flex aspect-[4/3] flex-col justify-between rounded-2xl p-5 transition-colors",
        dark ? "bg-foreground text-background hover:bg-foreground/90" : "bg-muted text-foreground hover:bg-muted/70"
      )}
    >
      <MapPin className="h-5 w-5" strokeWidth={1.5} />
      <span className="font-serif text-2xl font-bold leading-tight tracking-tight">
        {locality.name}
      </span>
    </Link>
  );
}

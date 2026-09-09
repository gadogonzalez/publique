import Link from "next/link";
import type { Location } from "@/lib/types/database";

/** Editorial location tile. No verified photography source is wired up
 * (see IMAGES note in the redesign report), so this renders as an
 * intentional dark tile with the zone name -- never a broken image. */
export function ZoneTile({ locality }: { locality: Location }) {
  return (
    <Link
      href={`/buscar?zona=${locality.id}`}
      className="group relative flex aspect-[4/3] shrink-0 items-end overflow-hidden rounded-xl bg-foreground"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity group-hover:from-black/70" />
      <span className="relative p-3 text-sm font-medium text-background">
        {locality.name}
      </span>
    </Link>
  );
}

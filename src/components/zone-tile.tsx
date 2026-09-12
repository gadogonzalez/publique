import Link from "next/link";
import type { Location } from "@/lib/types/database";

/** Neighborhood as a plain text link -- no chip, no photo, no border. */
export function ZoneTile({ locality }: { locality: Location }) {
  return (
    <Link
      href={`/buscar?zona=${locality.id}`}
      className="whitespace-nowrap text-sm font-medium text-foreground underline decoration-transparent underline-offset-4 transition-colors hover:decoration-foreground"
    >
      {locality.name}
    </Link>
  );
}

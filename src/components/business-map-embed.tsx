import { cn } from "@/lib/utils";

/** Inline Google Maps pin, no API key needed (the public `output=embed`
 * query works for a single-point map like this). Renders nothing if
 * there's no address or coordinates to point at. */
export function BusinessMapEmbed({
  name,
  address,
  latitude,
  longitude,
  className,
}: {
  name: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  className?: string;
}) {
  const query = latitude != null && longitude != null ? `${latitude},${longitude}` : address;
  if (!query) return null;

  return (
    <div className={cn("overflow-hidden rounded-xl bg-secondary", className)}>
      <iframe
        title={`Mapa de ${name}`}
        src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

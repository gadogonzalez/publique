import Link from "next/link";
import { ArrowRight, Home, MapPin, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const TILES = [
  {
    href: "/buscar",
    icon: Home,
    title: "Locales comerciales",
    body: "Tiendas, gastronomía, salud, belleza y más.",
    emphasis: false,
  },
  {
    href: "/buscar",
    icon: Wrench,
    title: "Servicios",
    body: "Profesionales, técnicos y servicios para el hogar.",
    emphasis: true,
  },
  {
    href: "/buscar",
    icon: MapPin,
    title: "Descubrí tu zona",
    body: "Explorá los negocios cerca tuyo.",
    emphasis: false,
  },
] as const;

/** The two primary discovery concepts from PUBLIQUE_PRODUCT_PRINCIPLES.md
 * §5 (Locales comerciales / Servicios), plus zone discovery, given equal
 * visual weight to a category icon row -- these are the product's real
 * top-level split, not just another category. */
export function DiscoveryTiles() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {TILES.map(({ href, icon: Icon, title, body, emphasis }) => (
        <Link
          key={title}
          href={href}
          className={cn(
            "group flex flex-col justify-between gap-8 rounded-2xl p-6 transition-colors sm:p-8",
            emphasis
              ? "bg-foreground text-background hover:bg-foreground/90"
              : "bg-muted text-foreground hover:bg-muted/70"
          )}
        >
          <Icon className="h-6 w-6" strokeWidth={1.5} />
          <div>
            <h3 className="font-serif text-xl font-bold tracking-tight">{title}</h3>
            <p
              className={cn(
                "mt-1 text-sm",
                emphasis ? "text-background/75" : "text-muted-foreground"
              )}
            >
              {body}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      ))}
    </div>
  );
}

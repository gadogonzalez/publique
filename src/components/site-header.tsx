"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { WIDE } from "@/components/home/width";
import { cn } from "@/lib/utils";
import type { Location } from "@/lib/types/database";

const LINKS = [
  { label: "Explorar", href: "/buscar", chevron: true },
  { label: "Categorías", href: "/buscar" },
  { label: "Zonas", href: "/buscar" },
  { label: "Para negocios", href: "/admin/login" },
];

// Premium, restrained glass -- pale lavender surface + blur + a barely
// visible border, not heavy glassmorphism (frosted blobs, glow, neon).
// Shared by the center nav pill and the search button so both read as
// one material.
const GLASS =
  "border border-white/50 bg-[rgba(242,239,252,0.65)] backdrop-blur-[18px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]";

/** Zone/location picker -- product context, not part of the brand. Sits
 * next to the logo, not inside it (see PUBLIQUE_PRODUCT_PRINCIPLES.md).
 * For now, picking a zone just scopes /buscar; it's the seam future
 * location-aware discovery (featured/nearby/etc.) hangs off. */
function LocationSelector({ localities }: { localities: Location[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(localities[0]?.name);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  if (localities.length === 0 || !current) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-0.5 text-sm text-muted-foreground transition-opacity hover:opacity-70"
      >
        {current}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 min-w-40 rounded-lg border border-border bg-card py-1 shadow-md">
          {localities.map((loc) => (
            <button
              key={loc.id}
              type="button"
              onClick={() => {
                setCurrent(loc.name);
                setOpen(false);
                router.push(`/buscar?zona=${loc.id}`);
              }}
              className={cn(
                "block w-full px-3 py-1.5 text-left text-sm hover:bg-secondary",
                loc.name === current && "font-medium text-foreground"
              )}
            >
              {loc.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SiteHeader({ localities = [] }: { localities?: Location[] }) {
  const [open, setOpen] = React.useState(false);
  // The homepage hero uses a wider grid (see PUBLIQUE_STYLE_GUIDE.md §8);
  // the header aligns to the same grid there so both feel like one system.
  // Every other route keeps the sitewide `.container` (1280px) unchanged.
  const isHome = usePathname() === "/";

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className={cn("flex h-20 items-center justify-between", isHome ? WIDE : "container")}>
        <div className="flex items-center gap-3">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight" onClick={() => setOpen(false)}>
            Publiqué
          </Link>
          <LocationSelector localities={localities} />
        </div>

        <nav className={cn("hidden items-center gap-1 rounded-full p-1.5 text-sm font-medium lg:flex", GLASS)}>
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-1 rounded-full px-4 py-2 transition-colors hover:bg-white/60"
            >
              {link.label}
              {link.chevron && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/buscar"
            aria-label="Buscar"
            className={cn("flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-white/70", GLASS)}
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link href="/admin/login" className={buttonVariants({ variant: "brand", size: "lg" })}>
            Publicá tu negocio
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/buscar"
            aria-label="Buscar"
            className={cn("flex h-11 w-11 items-center justify-center rounded-full", GLASS)}
          >
            <Search className="h-4 w-4" />
          </Link>
          <Button
            size="icon"
            variant="outline"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            <MenuToggleIcon open={open} duration={250} className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-x-0 top-20 bottom-0 z-40 flex-col overflow-y-auto border-t border-border bg-card/95 backdrop-blur lg:hidden",
          open ? "flex" : "hidden"
        )}
      >
        <div className="flex h-full flex-col justify-between gap-y-6 p-4">
          <div className="grid gap-y-1">
            {LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={buttonVariants({ variant: "ghost", className: "justify-start" })}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/admin/login"
            onClick={() => setOpen(false)}
            className={buttonVariants({ variant: "brand", className: "w-full" })}
          >
            Publicá tu negocio
          </Link>
        </div>
      </div>
    </header>
  );
}

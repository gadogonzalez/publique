"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { cn } from "@/lib/utils";
import type { Location } from "@/lib/types/database";

const LINKS = [
  { label: "Explorar", href: "/buscar" },
  { label: "Categorías", href: "/buscar" },
  { label: "Para negocios", href: "/admin/login" },
];

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
        className="flex items-center gap-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
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

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight" onClick={() => setOpen(false)}>
            Publiqué
          </Link>
          <LocationSelector localities={localities} />
        </div>

        <nav className="hidden items-center gap-1 rounded-full bg-muted p-1.5 text-sm font-medium sm:flex">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full px-3.5 py-1.5 transition-colors hover:bg-background"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/buscar"
            aria-label="Buscar"
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-background"
          >
            <Search className="h-4 w-4" />
          </Link>
        </nav>

        <Button
          size="icon"
          variant="outline"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
          className="sm:hidden"
        >
          <MenuToggleIcon open={open} duration={250} className="h-5 w-5" />
        </Button>
      </div>

      <div
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 z-40 flex-col overflow-y-auto border-t border-border bg-card/95 backdrop-blur sm:hidden",
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
            href="/buscar"
            onClick={() => setOpen(false)}
            className={buttonVariants({ variant: "dark", className: "w-full" })}
          >
            <Search className="h-4 w-4" />
            Buscar
          </Link>
        </div>
      </div>
    </header>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, MoreVertical, Search } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { HERO_GRID } from "@/components/home/width";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Categorías", href: "/buscar" },
  { label: "Servicios", href: "/buscar" },
  { label: "Zonas", href: "/buscar" },
];

// Premium, restrained glass -- pale lavender surface + blur + a barely
// visible border, not heavy glassmorphism (frosted blobs, glow, neon).
// Shared by the left nav pill and the right action group so the whole
// floating navigation reads as one material.
const GLASS =
  "border border-white/35 bg-[rgba(248,247,252,0.78)] backdrop-blur-[18px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]";

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex items-center gap-2 rounded-full px-3 py-2 font-serif text-base font-bold tracking-tight"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-brand-primary-foreground">
        <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
      </span>
      Publiqué
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  // Navigation floats over the full-bleed hero on the homepage (generous
  // top/side spacing, no max-width) and stays pinned while scrolling via
  // position:fixed (out of flow, so it never reserves layout space above
  // the hero, unlike `sticky`); every other route keeps the sitewide
  // `.container` (1280px) and a fixed-height sticky bar, unchanged.
  const isHome = usePathname() === "/";

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={cn("z-50", isHome ? "fixed inset-x-0 top-0" : "sticky top-0")}>
      <div
        className={cn(
          "flex items-center justify-between",
          isHome ? `${HERO_GRID} pt-7 sm:pt-8` : "container h-20"
        )}
      >
        <div className={cn("flex items-center gap-1 rounded-full p-1.5 text-sm font-medium", GLASS)}>
          <Logo onClick={() => setOpen(false)} />
          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full px-3.5 py-2 transition-colors hover:bg-white/60"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/buscar"
              aria-label="Más"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/60"
            >
              <MoreVertical className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className={cn("hidden items-center gap-1.5 rounded-full p-1.5 lg:flex", GLASS)}>
          <Link
            href="/admin/login"
            className={cn(buttonVariants({ variant: "brand" }), "rounded-[50px]")}
          >
            Publicá tu negocio
          </Link>
          <Link
            href="/buscar"
            aria-label="Buscar"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 transition-colors hover:bg-white"
          >
            <Search className="h-4 w-4" />
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
          "fixed inset-x-0 bottom-0 z-40 flex-col overflow-y-auto border-t border-border bg-card/95 backdrop-blur lg:hidden",
          isHome ? "top-24" : "top-20",
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

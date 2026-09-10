"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { useScroll } from "@/components/ui/use-scroll";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Categorías", href: "/buscar" },
  { label: "Zonas", href: "/buscar" },
  { label: "Para negocios", href: "/admin/login" },
];

export function SiteHeader() {
  const isHome = usePathname() === "/";
  const scrolled = useScroll(10);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // On the homepage the header overlays the hero photo until the page is
  // scrolled (or the mobile menu is open), then it picks up a solid,
  // blurred background -- same treatment every other page always has.
  const solid = !isHome || scrolled || open;

  return (
    <header
      className={cn(
        "left-0 right-0 top-0 z-50 transition-colors",
        isHome ? "fixed" : "relative border-b border-border",
        solid
          ? "border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-serif text-xl font-medium">Publique</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Guaymallén, Mendoza
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
          {LINKS.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
          <Link href="/buscar" aria-label="Buscar" className="hover:text-primary">
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

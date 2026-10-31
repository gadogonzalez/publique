"use client";

import * as React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { PubliqueIsotipo } from "@/components/brand/isotipo";
import { CategoryPictogram } from "@/components/category-icon";
import { HERO_GRID } from "@/components/home/width";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types/database";

/** Fixed, full-width, solid (not the old floating glass pill) -- same on
 * every route, so `<main>` carries a matching top padding (see layout.tsx)
 * instead of this component special-casing the homepage. Only two actions
 * live in the bar itself: the CTA and "Menú", which opens the mega menu
 * below with categories + secondary links -- everything else that used to
 * be top-level nav links moved in there. */
export function SiteHeader({ categories }: { categories: Category[] }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className={cn("flex h-20 items-center justify-between", HERO_GRID)}>
        <Link
          href="/"
          onClick={close}
          className="flex items-center gap-2 font-serif text-lg font-bold tracking-tight"
        >
          <PubliqueIsotipo className="h-7 w-7 shrink-0" />
          Publiqué
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/login"
            onClick={close}
            className={cn(buttonVariants({ variant: "brand" }), "rounded-full px-3 sm:px-4")}
          >
            <span className="sm:hidden">Publicá</span>
            <span className="hidden sm:inline">Publicá tu negocio</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="flex h-11 items-center gap-2 rounded-full border border-border px-3 text-sm font-medium transition-colors hover:bg-secondary sm:px-4"
          >
            <MenuToggleIcon open={open} duration={250} className="h-4 w-4" />
            <span className="hidden sm:inline">Menú</span>
          </button>
        </div>
      </div>

      {open && (
        <>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={close}
            className="fixed inset-0 top-20 z-40 bg-black/20"
          />
          <div className="absolute inset-x-0 top-full z-50 max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-border bg-card shadow-lg">
            <div className={cn("py-8", HERO_GRID)}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Categorías
              </p>
              {categories.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 lg:grid-cols-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categorias/${category.slug}`}
                      onClick={close}
                      className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                    >
                      <CategoryPictogram icon={category.icon} className="h-4 w-4 shrink-0 text-brand-primary" />
                      {category.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Todavía no hay categorías cargadas.</p>
              )}
              <Link
                href="/categorias"
                onClick={close}
                className="mt-4 inline-block text-sm font-medium text-brand-primary hover:underline"
              >
                Ver todas las categorías →
              </Link>

              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-border pt-6 text-sm">
                <Link
                  href="/admin/login"
                  onClick={close}
                  className="font-medium transition-colors hover:text-brand-primary"
                >
                  Sumá tu negocio
                </Link>
                {/* No page behind these yet -- inert, same treatment as
                    the footer's other placeholder labels, not a dead link. */}
                <span className="font-medium text-muted-foreground/60">Quiénes somos</span>
                <span className="font-medium text-muted-foreground/60">Contacto</span>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

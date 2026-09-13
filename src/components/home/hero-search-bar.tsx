"use client";

import * as React from "react";
import { ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Location } from "@/lib/types/database";

/**
 * Hero-only search control: query + location in one bar, submitting to
 * the same /buscar?q=&zona= contract the shared SearchBar and the zone
 * tiles already use. Deliberately separate from `@/components/search-bar`
 * (shared with /buscar) so this bar's layout/location field never affects
 * that page or the search backend.
 */
export function HeroSearchBar({ localities }: { localities: Location[] }) {
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const [zona, setZona] = React.useState<Location | undefined>(localities[0]);
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    if (zona) params.set("zona", zona.id);
    router.push(`/buscar?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-16 w-full items-center gap-1 rounded-full bg-white pl-5 pr-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:h-[68px]"
    >
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ej: veterinaria, plomero, comida, gimnasio..."
        aria-label="¿Qué necesitás?"
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground sm:text-base"
      />

      {localities.length > 0 && zona && (
        <div ref={ref} className="relative hidden shrink-0 border-l border-border pl-3 sm:block">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex items-center gap-1 whitespace-nowrap px-1 text-sm text-muted-foreground transition-opacity hover:opacity-70"
          >
            {zona.name}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {open && (
            <div className="absolute right-0 top-full z-50 mt-2 min-w-40 rounded-lg border border-border bg-card py-1 shadow-md">
              {localities.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => {
                    setZona(loc);
                    setOpen(false);
                  }}
                  className={cn(
                    "block w-full px-3 py-1.5 text-left text-sm hover:bg-secondary",
                    loc.id === zona.id && "font-medium text-foreground"
                  )}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        className="ml-1 flex h-12 shrink-0 items-center rounded-full bg-brand-primary px-6 text-sm font-medium text-brand-primary-foreground transition-colors hover:bg-brand-primary/90 sm:h-[52px]"
      >
        Buscar
      </button>
    </form>
  );
}

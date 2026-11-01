"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/select";
import type { Category, Location } from "@/lib/types/database";

export function SearchFilters({
  categories,
  localities,
}: {
  categories: Category[];
  localities: Location[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page"); // new filter = new result set, back to page 1
    router.replace(`/buscar?${params.toString()}`, { scroll: false });
  }

  const hasFilters = ["q", "categoria", "zona"].some((k) => searchParams.has(k));

  return (
    <div className="flex flex-wrap items-end gap-4">
      <label className="text-sm">
        <span className="mb-1 block text-xs font-medium text-muted-foreground">
          Categoría
        </span>
        <Select
          value={searchParams.get("categoria") ?? ""}
          onChange={(e) => updateParam("categoria", e.target.value)}
          className="w-auto"
        >
          <option value="">Todas</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
      </label>
      <label className="text-sm">
        <span className="mb-1 block text-xs font-medium text-muted-foreground">
          Zona
        </span>
        <Select
          value={searchParams.get("zona") ?? ""}
          onChange={(e) => updateParam("zona", e.target.value)}
          className="w-auto"
        >
          <option value="">Todas</option>
          {localities.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </Select>
      </label>
      {hasFilters && (
        <button
          type="button"
          onClick={() => router.replace("/buscar", { scroll: false })}
          className="h-11 rounded-lg px-3 text-sm font-medium text-brand-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

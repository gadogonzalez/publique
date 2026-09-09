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
    router.push(`/buscar?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-4 text-sm">
      <Select
        value={searchParams.get("categoria") ?? ""}
        onChange={(e) => updateParam("categoria", e.target.value)}
        aria-label="Categoría"
        className="h-auto w-auto rounded-none border-0 border-b border-border bg-transparent px-0 py-1 focus-visible:ring-0 focus-visible:border-primary"
      >
        <option value="">Todas las categorías</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </Select>
      <Select
        value={searchParams.get("zona") ?? ""}
        onChange={(e) => updateParam("zona", e.target.value)}
        aria-label="Zona"
        className="h-auto w-auto rounded-none border-0 border-b border-border bg-transparent px-0 py-1 focus-visible:ring-0 focus-visible:border-primary"
      >
        <option value="">Todas las zonas</option>
        {localities.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </Select>
    </div>
  );
}

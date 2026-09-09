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
    <div className="flex flex-wrap gap-4">
      <label className="text-sm">
        <span className="mb-1 block text-xs font-medium text-muted-foreground">
          Categoría
        </span>
        <Select
          value={searchParams.get("categoria") ?? ""}
          onChange={(e) => updateParam("categoria", e.target.value)}
          className="h-9 w-auto py-1"
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
          className="h-9 w-auto py-1"
        >
          <option value="">Todas</option>
          {localities.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </Select>
      </label>
    </div>
  );
}

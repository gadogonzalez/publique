"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Category, Location } from "@/lib/types/database";

const STATUSES = [
  { value: "draft", label: "Borrador" },
  { value: "active", label: "Activo" },
  { value: "past_due", label: "Pago pendiente" },
  { value: "suspended", label: "Suspendido" },
  { value: "archived", label: "Archivado" },
];

export function AdminListFilters({
  categories,
  localities,
}: {
  categories: Category[];
  localities: Location[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/admin/negocios?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Input
        placeholder="Buscar por nombre..."
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => update("q", e.target.value)}
        className="sm:max-w-xs"
      />
      <Select
        value={searchParams.get("status") ?? ""}
        onChange={(e) => update("status", e.target.value)}
      >
        <option value="">Todos los estados</option>
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </Select>
      <Select
        value={searchParams.get("categoria") ?? ""}
        onChange={(e) => update("categoria", e.target.value)}
      >
        <option value="">Todas las categorías</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
      <Select
        value={searchParams.get("zona") ?? ""}
        onChange={(e) => update("zona", e.target.value)}
      >
        <option value="">Todas las localidades</option>
        {localities.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </Select>
    </div>
  );
}

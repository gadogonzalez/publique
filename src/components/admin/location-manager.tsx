"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createLocation, deleteLocation } from "@/app/admin/(dashboard)/ubicaciones/actions";
import type { Location, LocationType } from "@/lib/types/database";

const TYPE_LABEL: Record<LocationType, string> = {
  country: "País",
  province: "Provincia",
  department: "Departamento",
  locality: "Localidad / Zona",
};

const PARENT_TYPE: Record<LocationType, LocationType | null> = {
  country: null,
  province: "country",
  department: "province",
  locality: "department",
};

export function LocationManager({ locations }: { locations: Location[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<LocationType>("locality");
  const [parentId, setParentId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const byParent = useMemo(() => {
    const map = new Map<string, Location[]>();
    for (const loc of locations) {
      const key = loc.parent_id ?? "root";
      map.set(key, [...(map.get(key) ?? []), loc]);
    }
    return map;
  }, [locations]);

  const parentOptions = useMemo(() => {
    const requiredType = PARENT_TYPE[type];
    return requiredType ? locations.filter((l) => l.type === requiredType) : [];
  }, [locations, type]);

  function renderTree(parentId: string | null, depth = 0) {
    const children = byParent.get(parentId ?? "root") ?? [];
    return children.map((loc) => (
      <div key={loc.id}>
        <div
          className="flex items-center justify-between border-b border-border py-2 text-sm"
          style={{ paddingLeft: depth * 20 }}
        >
          <span>
            {loc.name}{" "}
            <span className="text-xs text-muted-foreground">({TYPE_LABEL[loc.type]})</span>
          </span>
          <button
            onClick={() =>
              startTransition(async () => {
                const result = await deleteLocation(loc.id);
                if (!result.ok) setError(result.error ?? "Error");
                else router.refresh();
              })
            }
            aria-label={`Borrar ${loc.name}`}
          >
            <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
        {renderTree(loc.id, depth + 1)}
      </div>
    ));
  }

  return (
    <div className="space-y-6">
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          startTransition(async () => {
            const result = await createLocation(type, name, parentId);
            if (!result.ok) return setError(result.error ?? "Error");
            setName("");
            router.refresh();
          });
        }}
      >
        <div>
          <label className="mb-1 block text-xs font-medium">Tipo</label>
          <Select
            value={type}
            onChange={(e) => {
              setType(e.target.value as LocationType);
              setParentId("");
            }}
          >
            <option value="province">Provincia</option>
            <option value="department">Departamento</option>
            <option value="locality">Localidad / Zona</option>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">
            {PARENT_TYPE[type] ? TYPE_LABEL[PARENT_TYPE[type]!] : ""} superior
          </label>
          <Select value={parentId} onChange={(e) => setParentId(e.target.value)}>
            <option value="">Elegí...</option>
            {parentOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Nombre</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <Button type="submit" disabled={isPending}>
          <Plus className="h-4 w-4" /> Crear
        </Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="rounded-xl border border-border bg-card p-4">{renderTree(null)}</div>
    </div>
  );
}

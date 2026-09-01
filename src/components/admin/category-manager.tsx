"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createCategory,
  createService,
  deleteCategory,
  deleteService,
} from "@/app/admin/(dashboard)/categorias/actions";
import type { Category, Service } from "@/lib/types/database";

export function CategoryManager({
  categories,
  services,
}: {
  categories: Category[];
  services: Service[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [newCategory, setNewCategory] = useState("");
  const [newService, setNewService] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    router.refresh();
  }

  function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createCategory(newCategory);
      if (!result.ok) return setError(result.error ?? "Error");
      setNewCategory("");
      refresh();
    });
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreateCategory} className="flex gap-2">
        <Input
          placeholder="Nueva categoría (ej: Mascotas)"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="max-w-xs"
        />
        <Button type="submit" disabled={isPending}>
          <Plus className="h-4 w-4" /> Crear categoría
        </Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categories.map((c) => {
          const categoryServices = services.filter((s) => s.category_id === c.id);
          return (
            <div key={c.id} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">{c.name}</h3>
                <button
                  onClick={() =>
                    startTransition(async () => {
                      const result = await deleteCategory(c.id);
                      if (!result.ok) setError(result.error ?? "Error");
                      else refresh();
                    })
                  }
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Borrar categoría
                </button>
              </div>

              <ul className="mb-3 space-y-1">
                {categoryServices.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between rounded-md bg-secondary px-2 py-1 text-sm"
                  >
                    {s.name}
                    <button
                      onClick={() =>
                        startTransition(async () => {
                          const result = await deleteService(s.id);
                          if (!result.ok) setError(result.error ?? "Error");
                          else refresh();
                        })
                      }
                      aria-label={`Borrar ${s.name}`}
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  </li>
                ))}
                {categoryServices.length === 0 && (
                  <li className="text-xs text-muted-foreground">Sin servicios todavía.</li>
                )}
              </ul>

              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const value = newService[c.id] ?? "";
                  startTransition(async () => {
                    const result = await createService(value, c.id);
                    if (!result.ok) return setError(result.error ?? "Error");
                    setNewService((prev) => ({ ...prev, [c.id]: "" }));
                    refresh();
                  });
                }}
              >
                <Input
                  placeholder="Nuevo servicio"
                  value={newService[c.id] ?? ""}
                  onChange={(e) =>
                    setNewService((prev) => ({ ...prev, [c.id]: e.target.value }))
                  }
                  className="h-9 text-sm"
                />
                <Button type="submit" size="sm" variant="outline" disabled={isPending}>
                  Agregar
                </Button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}

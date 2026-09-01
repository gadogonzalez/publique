"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  createCategory,
  createKeyword,
  createService,
  deleteCategory,
  deleteKeyword,
  deleteService,
} from "@/app/admin/(dashboard)/categorias/actions";
import type { Category, Keyword, Service } from "@/lib/types/database";

/** Inline "add/remove alias" chips, reused for both a service's and a
 * category's keywords. Keywords are what let a natural phrase like "no sale
 * agua" reach a service in search -- see docs/SEARCH.md. */
function KeywordEditor({
  keywords,
  target,
  onChanged,
}: {
  keywords: Keyword[];
  target: { service_id?: string; category_id?: string };
  onChanged: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  function add() {
    const term = draft.trim();
    if (!term) return;
    startTransition(async () => {
      const result = await createKeyword(term, target);
      if (!result.ok) return setError(result.error ?? "Error");
      setError(null);
      setDraft("");
      onChanged();
    });
  }

  return (
    <div className="mt-1.5">
      <div className="flex flex-wrap items-center gap-1.5">
        {keywords.map((k) => (
          <Badge
            key={k.id}
            variant="outline"
            className="cursor-pointer text-xs"
            onClick={() =>
              startTransition(async () => {
                const result = await deleteKeyword(k.id);
                if (!result.ok) setError(result.error ?? "Error");
                else onChanged();
              })
            }
          >
            {k.term} ×
          </Badge>
        ))}
        <Input
          placeholder="+ alias (ej: no sale agua)"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          disabled={isPending}
          className="h-7 w-40 text-xs"
        />
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function CategoryManager({
  categories,
  services,
  keywords,
}: {
  categories: Category[];
  services: Service[];
  keywords: Keyword[];
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

              <div className="mb-3 border-b border-border pb-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Alias de la categoría
                </p>
                <KeywordEditor
                  keywords={keywords.filter((k) => k.category_id === c.id)}
                  target={{ category_id: c.id }}
                  onChanged={refresh}
                />
              </div>

              <ul className="mb-3 space-y-2">
                {categoryServices.map((s) => (
                  <li key={s.id} className="rounded-md bg-secondary px-2 py-1.5 text-sm">
                    <div className="flex items-center justify-between">
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
                    </div>
                    <KeywordEditor
                      keywords={keywords.filter((k) => k.service_id === s.id)}
                      target={{ service_id: s.id }}
                      onChanged={refresh}
                    />
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

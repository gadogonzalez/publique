"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  createFeaturedPlacement,
  updateFeaturedPlacement,
} from "@/app/admin/(dashboard)/destacados/actions";
import type { Category, FeaturedPlacement, FeaturedPlacementType, Location } from "@/lib/types/database";

type Slot = FeaturedPlacement & { business_name: string };

const TYPE_LABELS: Record<FeaturedPlacementType, string> = {
  primary: "Principal",
  secondary: "Secundario",
};

function isCurrentlyActive(slot: Slot, now: number): boolean {
  return (
    slot.is_active &&
    new Date(slot.starts_at).getTime() <= now &&
    (!slot.ends_at || new Date(slot.ends_at).getTime() > now)
  );
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("es-AR");
}

function SlotRow({ slot, onRelease, pending }: { slot: Slot; onRelease?: () => void; pending?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-3 py-2 text-sm">
      <div>
        <p className="font-medium">{slot.business_name}</p>
        <p className="text-xs text-muted-foreground">
          {TYPE_LABELS[slot.type]} · desde {formatDate(slot.starts_at)}
          {slot.ends_at ? ` hasta ${formatDate(slot.ends_at)}` : " · sin vencimiento"}
          {!slot.is_active && " · desactivado"}
        </p>
      </div>
      {onRelease && (
        <Button type="button" variant="outline" size="sm" onClick={onRelease} disabled={pending}>
          Liberar
        </Button>
      )}
    </div>
  );
}

export function FeaturedManager({
  category,
  market,
  slots,
  eligibleBusinesses,
  now,
}: {
  category: Category;
  market: Location;
  slots: Slot[];
  eligibleBusinesses: { id: string; name: string }[];
  now: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState("");
  const [type, setType] = useState<FeaturedPlacementType>("secondary");
  const [startsAt, setStartsAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [endsAt, setEndsAt] = useState("");

  const active = slots.filter((s) => isCurrentlyActive(s, now));
  const primarySlot = active.find((s) => s.type === "primary") ?? null;
  const secondarySlots = active.filter((s) => s.type === "secondary");
  const activeIds = new Set(active.map((s) => s.id));
  const history = slots.filter((s) => !activeIds.has(s.id));

  function refresh() {
    router.refresh();
  }

  function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!businessId) {
      setError("Elegí un negocio");
      return;
    }
    startTransition(async () => {
      const result = await createFeaturedPlacement({
        business_id: businessId,
        category_id: category.id,
        market_id: market.id,
        type,
        starts_at: new Date(startsAt).toISOString(),
        ends_at: endsAt ? new Date(endsAt).toISOString() : null,
      });
      if (!result.ok) {
        setError(result.error ?? "No se pudo asignar el espacio");
        return;
      }
      setBusinessId("");
      setEndsAt("");
      refresh();
    });
  }

  function handleRelease(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await updateFeaturedPlacement(id, { is_active: false });
      if (!result.ok) setError(result.error ?? "No se pudo liberar el espacio");
      else refresh();
    });
  }

  return (
    <div className="max-w-3xl space-y-8">
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-1 text-sm font-semibold">Destacado principal</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Un solo espacio: ocupa el banner de la página de &quot;{category.name}&quot;.
        </p>
        {primarySlot ? (
          <SlotRow slot={primarySlot} onRelease={() => handleRelease(primarySlot.id)} pending={isPending} />
        ) : (
          <p className="text-sm text-muted-foreground">Sin destacado principal activo.</p>
        )}
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-1 text-sm font-semibold">
          Destacados secundarios ({secondarySlots.length}/4)
        </h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Cards debajo del banner principal, en &quot;{category.name}&quot;.
        </p>
        {secondarySlots.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin destacados secundarios activos.</p>
        ) : (
          <div className="space-y-2">
            {secondarySlots.map((s) => (
              <SlotRow key={s.id} slot={s} onRelease={() => handleRelease(s.id)} pending={isPending} />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold">Asignar espacio</h2>
        <form onSubmit={handleAssign} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="fm-business">Negocio (plan Básico en esta categoría)</Label>
            <Select id="fm-business" value={businessId} onChange={(e) => setBusinessId(e.target.value)}>
              <option value="">Elegí un negocio</option>
              {eligibleBusinesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
            {eligibleBusinesses.length === 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                Ningún negocio de &quot;{category.name}&quot; tiene plan Básico todavía.
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="fm-type">Tipo de espacio</Label>
            <Select
              id="fm-type"
              value={type}
              onChange={(e) => setType(e.target.value as FeaturedPlacementType)}
            >
              <option value="secondary">Secundario</option>
              <option value="primary">Principal</option>
            </Select>
          </div>
          <div />
          <div>
            <Label htmlFor="fm-start">Inicio</Label>
            <Input
              id="fm-start"
              type="date"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="fm-end">Vencimiento (opcional)</Label>
            <Input id="fm-end" type="date" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            {error && <p className="mb-2 text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={isPending}>
              {isPending ? "Asignando..." : "Asignar"}
            </Button>
          </div>
        </form>
      </section>

      {history.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Historial</h2>
          <div className="space-y-2">
            {history.map((s) => (
              <SlotRow key={s.id} slot={s} pending={isPending} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/image-upload";
import { createBanner } from "@/app/admin/(dashboard)/banners/actions";

/** New homepage banner: a Premium business + desktop and mobile images. */
export function BannerForm({ businesses }: { businesses: { id: string; name: string }[] }) {
  const [businessId, setBusinessId] = useState("");
  const [desktop, setDesktop] = useState<string | null>(null);
  const [mobile, setMobile] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (businesses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay negocios activos con plan Premium. Asigná el plan desde Negocios para poder crear un banner.
      </p>
    );
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const result = await createBanner({
        businessId,
        desktopImageUrl: desktop ?? "",
        mobileImageUrl: mobile ?? "",
        altText,
        sortOrder: Number(sortOrder) || 0,
      });
      if (!result.ok) {
        setError(result.error ?? "No se pudo crear el banner");
        return;
      }
      setBusinessId("");
      setDesktop(null);
      setMobile(null);
      setAltText("");
      setSortOrder("0");
    });
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
      <div className="space-y-2">
        <Label htmlFor="banner-business">Negocio (plan Premium)</Label>
        <Select id="banner-business" value={businessId} onChange={(e) => setBusinessId(e.target.value)}>
          <option value="">Elegí un negocio</option>
          {businesses.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ImageUpload
          bucket="home-banners"
          pathPrefix={businessId || "sin-negocio"}
          value={desktop}
          onChange={setDesktop}
          label="Imagen de escritorio (recomendado 2000×460)"
        />
        <ImageUpload
          bucket="home-banners"
          pathPrefix={businessId || "sin-negocio"}
          value={mobile}
          onChange={setMobile}
          label="Imagen de celular (recomendado 750×1020)"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
        <div className="space-y-2">
          <Label htmlFor="banner-alt">Texto alternativo (qué dice el banner)</Label>
          <Input id="banner-alt" value={altText} onChange={(e) => setAltText(e.target.value)} maxLength={300} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="banner-order">Orden</Label>
          <Input id="banner-order" type="number" min={0} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="button" variant="brand" onClick={submit} disabled={pending}>
        {pending ? "Guardando…" : "Crear banner"}
      </Button>
    </div>
  );
}

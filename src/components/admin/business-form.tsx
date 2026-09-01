"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/admin/image-upload";
import { GalleryUpload } from "@/components/admin/gallery-upload";
import { saveBusiness } from "@/app/admin/(dashboard)/negocios/actions";
import { businessFormSchema } from "@/lib/validations/business";
import { slugify } from "@/lib/utils";
import type {
  BusinessWithRelations,
  Category,
  Service,
  Location,
  Plan,
  BusinessStatus,
} from "@/lib/types/database";

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const STATUS_OPTIONS: { value: BusinessStatus; label: string }[] = [
  { value: "draft", label: "Borrador" },
  { value: "active", label: "Activo" },
  { value: "past_due", label: "Pago pendiente" },
  { value: "suspended", label: "Suspendido" },
  { value: "archived", label: "Archivado" },
];

interface BusinessFormProps {
  initial?: BusinessWithRelations | null;
  categories: Category[];
  services: Service[];
  localities: Location[];
  department: Location | null;
  plans: Plan[];
}

interface HourRow {
  day_of_week: number;
  opens_at: string | null;
  closes_at: string | null;
  closed: boolean;
}

function defaultHours(initial?: BusinessWithRelations | null): HourRow[] {
  return Array.from({ length: 7 }, (_, day) => {
    const existing = initial?.hours.find((h) => h.day_of_week === day);
    return {
      day_of_week: day,
      opens_at: existing?.opens_at?.slice(0, 5) ?? null,
      closes_at: existing?.closes_at?.slice(0, 5) ?? null,
      closed: existing ? existing.closed : day === 0,
    };
  });
}

export function BusinessForm({
  initial,
  categories,
  services,
  localities,
  department,
  plans,
}: BusinessFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [businessId] = useState(() => initial?.id ?? crypto.randomUUID());

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [shortDescription, setShortDescription] = useState(initial?.short_description ?? "");
  const [longDescription, setLongDescription] = useState(initial?.long_description ?? "");
  const [whatsapp, setWhatsapp] = useState(initial?.whatsapp ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [website, setWebsite] = useState(initial?.website ?? "");
  const [instagram, setInstagram] = useState(initial?.instagram ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [locationId, setLocationId] = useState(initial?.location_id ?? "");
  const [latitude, setLatitude] = useState(initial?.latitude?.toString() ?? "");
  const [longitude, setLongitude] = useState(initial?.longitude?.toString() ?? "");
  const [status, setStatus] = useState<BusinessStatus>(initial?.status ?? "draft");
  const [planId, setPlanId] = useState(initial?.plan_id ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [categoryIds, setCategoryIds] = useState<string[]>(
    initial?.categories.map((c) => c.id) ?? []
  );
  const [serviceIds, setServiceIds] = useState<string[]>(
    initial?.services.map((s) => s.id) ?? []
  );
  const [serviceAreaIds, setServiceAreaIds] = useState<string[]>(
    initial?.service_areas.map((a) => a.id) ?? []
  );
  const [keywords, setKeywords] = useState<string[]>(
    initial?.keywords.map((k) => k.term) ?? []
  );
  const [keywordDraft, setKeywordDraft] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(initial?.logo_url ?? null);
  const [coverUrl, setCoverUrl] = useState<string | null>(initial?.cover_image_url ?? null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>(
    initial?.images.map((i) => i.url) ?? []
  );
  const [hours, setHours] = useState<HourRow[]>(defaultHours(initial));

  const relevantServices = useMemo(
    () => services.filter((s) => categoryIds.includes(s.category_id)),
    [services, categoryIds]
  );

  const serviceAreaOptions = useMemo(
    () => [...(department ? [department] : []), ...localities],
    [department, localities]
  );

  function toggle(list: string[], value: string, setList: (v: string[]) => void) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function addKeyword() {
    const term = keywordDraft.trim();
    if (term && !keywords.includes(term)) setKeywords([...keywords, term]);
    setKeywordDraft("");
  }

  function updateHour(day: number, patch: Partial<HourRow>) {
    setHours((prev) => prev.map((h) => (h.day_of_week === day ? { ...h, ...patch } : h)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = {
      id: businessId,
      name,
      slug,
      short_description: shortDescription || undefined,
      long_description: longDescription || undefined,
      logo_url: logoUrl ?? undefined,
      cover_image_url: coverUrl ?? undefined,
      whatsapp: whatsapp || undefined,
      phone: phone || undefined,
      email: email || undefined,
      website: website || undefined,
      instagram: instagram || undefined,
      address: address || undefined,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      location_id: locationId,
      status,
      plan_id: planId || null,
      featured,
      category_ids: categoryIds,
      service_ids: serviceIds,
      service_area_ids: serviceAreaIds,
      keywords,
      gallery_urls: galleryUrls,
      hours,
    };

    const parsed = businessFormSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Revisá los datos del formulario");
      return;
    }

    startTransition(async () => {
      const result = await saveBusiness(parsed.data);
      if (!result.ok) {
        setError(result.error ?? "No se pudo guardar");
        return;
      }
      router.push("/admin/negocios");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-10">
      {/* Basic information */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Información básica</h2>
        <div>
          <Label htmlFor="name">Nombre del negocio</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
          />
        </div>
        <div>
          <Label htmlFor="slug">URL (slug)</Label>
          <Input
            id="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlug(slugify(e.target.value));
              setSlugTouched(true);
            }}
          />
          <p className="mt-1 text-xs text-muted-foreground">/negocios/{slug || "..."}</p>
        </div>
        <div>
          <Label htmlFor="short">Descripción corta</Label>
          <Input
            id="short"
            maxLength={200}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="long">Descripción completa</Label>
          <Textarea
            id="long"
            rows={5}
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <ImageUpload
            bucket="business-logos"
            pathPrefix={businessId}
            value={logoUrl}
            onChange={setLogoUrl}
            label="Logo"
            aspect="square"
          />
          <div className="flex-1">
            <ImageUpload
              bucket="business-covers"
              pathPrefix={businessId}
              value={coverUrl}
              onChange={setCoverUrl}
              label="Imagen de portada"
              aspect="wide"
            />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Contacto</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="whatsapp">WhatsApp (con código de país)</Label>
            <Input
              id="whatsapp"
              placeholder="5492615551234"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="website">Sitio web</Label>
            <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram (URL)</Label>
            <Input
              id="instagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Ubicación</h2>
        <div>
          <Label htmlFor="address">Dirección</Label>
          <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="locality">Localidad (base)</Label>
            <Select
              id="locality"
              required
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
            >
              <option value="">Elegí una localidad</option>
              {localities.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="lat">Latitud</Label>
            <Input id="lat" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="lng">Longitud</Label>
            <Input id="lng" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Zonas de cobertura (además de la localidad base)</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {serviceAreaOptions.map((loc) => (
              <button
                type="button"
                key={loc.id}
                onClick={() => toggle(serviceAreaIds, loc.id, setServiceAreaIds)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  serviceAreaIds.includes(loc.id)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border"
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Business information */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Categorías, servicios y palabras clave
        </h2>
        <div>
          <Label>Categorías</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => toggle(categoryIds, c.id, setCategoryIds)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  categoryIds.includes(c.id)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
        {relevantServices.length > 0 && (
          <div>
            <Label>Servicios</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {relevantServices.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => toggle(serviceIds, s.id, setServiceIds)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    serviceIds.includes(s.id)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <div>
          <Label htmlFor="keyword">Palabras clave adicionales</Label>
          <div className="flex gap-2">
            <Input
              id="keyword"
              value={keywordDraft}
              placeholder="Ej: urgencias, abre los domingos"
              onChange={(e) => setKeywordDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addKeyword();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addKeyword}>
              Agregar
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {keywords.map((k) => (
              <Badge key={k} className="cursor-pointer" onClick={() => setKeywords(keywords.filter((x) => x !== k))}>
                {k} ×
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Media */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Fotos del negocio</h2>
        <GalleryUpload pathPrefix={businessId} value={galleryUrls} onChange={setGalleryUrls} />
      </section>

      {/* Hours */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Horarios</h2>
        {hours.map((h) => (
          <div key={h.day_of_week} className="flex flex-wrap items-center gap-3 text-sm">
            <label className="flex w-32 items-center gap-2">
              <input
                type="checkbox"
                checked={!h.closed}
                onChange={(e) => updateHour(h.day_of_week, { closed: !e.target.checked })}
              />
              {DAY_NAMES[h.day_of_week]}
            </label>
            {!h.closed && (
              <>
                <Input
                  type="time"
                  className="w-32"
                  value={h.opens_at ?? ""}
                  onChange={(e) => updateHour(h.day_of_week, { opens_at: e.target.value })}
                />
                <span>a</span>
                <Input
                  type="time"
                  className="w-32"
                  value={h.closes_at ?? ""}
                  onChange={(e) => updateHour(h.day_of_week, { closes_at: e.target.value })}
                />
              </>
            )}
          </div>
        ))}
      </section>

      {/* Commercial */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Comercial</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="plan">Plan</Label>
            <Select id="plan" value={planId} onChange={(e) => setPlanId(e.target.value)}>
              <option value="">Sin plan</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Estado</Label>
            <Select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as BusinessStatus)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </div>
          <label className="mt-6 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Destacado
          </label>
        </div>
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar negocio"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

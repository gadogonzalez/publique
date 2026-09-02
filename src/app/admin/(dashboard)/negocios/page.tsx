import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/data/taxonomy";
import { getLocalities } from "@/lib/data/locations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminListFilters } from "@/components/admin/list-filters";
import { StatusActions } from "@/components/admin/status-actions";
import type { Business, BusinessStatus, Category, Location, Plan } from "@/lib/types/database";

interface BusinessListRow extends Business {
  location: Location | null;
  plan: Plan | null;
  business_categories: { category: Category | null }[] | null;
}

const STATUS_LABEL: Record<string, string> = {
  draft: "Borrador",
  active: "Activo",
  past_due: "Pago pendiente",
  suspended: "Suspendido",
  archived: "Archivado",
};

interface NegociosPageProps {
  searchParams: Promise<{ q?: string; status?: string; categoria?: string; zona?: string }>;
}

export default async function NegociosPage({ searchParams }: NegociosPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  // See src/lib/data/businesses.ts BUSINESS_SELECT for why `locations` needs
  // the explicit FK name here: `businesses` reaches `locations` both via
  // location_id directly and via business_service_areas, so an unqualified
  // `location:locations(*)` embed is ambiguous (PGRST201).
  let query = supabase
    .from("businesses")
    .select(
      params.categoria
        ? "*, location:locations!businesses_location_id_fkey(*), plan:plans(*), business_categories!inner(category_id, category:categories(*))"
        : "*, location:locations!businesses_location_id_fkey(*), plan:plans(*), business_categories(category_id, category:categories(*))"
    )
    .order("updated_at", { ascending: false });

  if (params.q) query = query.ilike("name", `%${params.q}%`);
  if (params.status) query = query.eq("status", params.status);
  if (params.zona) query = query.eq("location_id", params.zona);
  if (params.categoria) query = query.eq("business_categories.category_id", params.categoria);

  const [{ data: businesses, error }, categories, localities] = await Promise.all([
    query,
    getCategories(),
    getLocalities(),
  ]);

  if (error) throw error;
  const rows = (businesses ?? []) as unknown as BusinessListRow[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Negocios</h1>
        <Button asChild>
          <Link href="/admin/negocios/nuevo">
            <Plus className="h-4 w-4" /> Crear negocio
          </Link>
        </Button>
      </div>

      <AdminListFilters categories={categories} localities={localities} />

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-border bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Negocio</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Localidad</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Destacado</th>
              <th className="px-4 py-3">Actualizado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/negocios/${b.id}/editar`}
                    className="font-medium hover:underline"
                  >
                    {b.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {b.business_categories?.[0]?.category?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {b.location?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{b.plan?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge variant={b.status === "active" ? "primary" : "outline"}>
                    {STATUS_LABEL[b.status] ?? b.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">{b.featured ? "★" : ""}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(b.updated_at).toLocaleDateString("es-AR")}
                </td>
                <td className="px-4 py-3">
                  <StatusActions businessId={b.id} status={b.status as BusinessStatus} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No hay negocios que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

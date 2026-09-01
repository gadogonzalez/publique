import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function getCounts() {
  const supabase = await createClient();
  const [total, active, draft, suspended, archived, featured, recent] =
    await Promise.all([
      supabase.from("businesses").select("id", { count: "exact", head: true }),
      supabase
        .from("businesses")
        .select("id", { count: "exact", head: true })
        .eq("status", "active"),
      supabase
        .from("businesses")
        .select("id", { count: "exact", head: true })
        .eq("status", "draft"),
      supabase
        .from("businesses")
        .select("id", { count: "exact", head: true })
        .eq("status", "suspended"),
      supabase
        .from("businesses")
        .select("id", { count: "exact", head: true })
        .eq("status", "archived"),
      supabase
        .from("businesses")
        .select("id", { count: "exact", head: true })
        .eq("featured", true),
      supabase
        .from("businesses")
        .select("id, name, slug, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  return {
    total: total.count ?? 0,
    active: active.count ?? 0,
    draft: draft.count ?? 0,
    suspended: suspended.count ?? 0,
    archived: archived.count ?? 0,
    featured: featured.count ?? 0,
    recent: recent.data ?? [],
  };
}

const STATUS_LABEL: Record<string, string> = {
  draft: "Borrador",
  active: "Activo",
  past_due: "Pago pendiente",
  suspended: "Suspendido",
  archived: "Archivado",
};

export default async function AdminDashboardPage() {
  const counts = await getCounts();

  const metrics = [
    { label: "Total de negocios", value: counts.total },
    { label: "Activos", value: counts.active },
    { label: "Borradores", value: counts.draft },
    { label: "Suspendidos", value: counts.suspended },
    { label: "Archivados", value: counts.archived },
    { label: "Destacados", value: counts.featured },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-2xl font-bold">{m.value}</p>
            <p className="text-sm text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
          Negocios recientes
        </h2>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <tbody>
              {counts.recent.map((b) => (
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
                    {STATUS_LABEL[b.status] ?? b.status}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {new Date(b.created_at).toLocaleDateString("es-AR")}
                  </td>
                </tr>
              ))}
              {counts.recent.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-muted-foreground" colSpan={3}>
                    Todavía no hay negocios cargados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

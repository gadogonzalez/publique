import Image from "next/image";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllHomeBanners, getBannerEligibleBusinesses } from "@/lib/data/banners";
import { getPlanCapabilities } from "@/lib/plans";
import { BannerForm } from "@/components/admin/banner-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteBanner, setBannerActive } from "./actions";

export default async function BannersPage() {
  await requireAdmin();
  const [banners, eligible] = await Promise.all([getAllHomeBanners(), getBannerEligibleBusinesses()]);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold">Banners del home</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Banners de negocios Premium. Se muestran en el home, en orden, como carrusel. Un banner deja de
        mostrarse si el negocio se desactiva o deja de tener plan Premium.
      </p>

      <h2 className="mb-3 mt-8 font-semibold">Nuevo banner</h2>
      <BannerForm businesses={eligible} />

      <h2 className="mb-3 mt-10 font-semibold">Banners cargados</h2>
      {banners.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía no hay banners.</p>
      ) : (
        <ul className="space-y-3">
          {banners.map((b) => {
            const visible =
              b.is_active &&
              b.business?.status === "active" &&
              getPlanCapabilities(b.business.plan).canHaveHomeBanner;
            return (
              <li key={b.id} className="flex flex-col gap-3 rounded-xl border border-border p-3 sm:flex-row sm:items-center">
                <div className="relative h-16 w-full shrink-0 overflow-hidden rounded-lg bg-secondary sm:w-64">
                  <Image src={b.desktop_image_url} alt="" fill sizes="256px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-semibold">{b.business?.name ?? "Negocio eliminado"}</p>
                  <p className="text-muted-foreground">Orden {b.sort_order}</p>
                  <div className="mt-1 flex gap-2">
                    {visible ? <Badge>Visible</Badge> : <Badge variant="outline">No se muestra</Badge>}
                    {b.is_active && !visible && (
                      <span className="text-xs text-muted-foreground">El negocio no está activo o no es Premium</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <form action={setBannerActive.bind(null, b.id, !b.is_active)}>
                    <Button type="submit" variant="outline" size="sm">
                      {b.is_active ? "Pausar" : "Activar"}
                    </Button>
                  </form>
                  <form action={deleteBanner.bind(null, b.id)}>
                    <Button type="submit" variant="ghost" size="sm" className="text-destructive">
                      Borrar
                    </Button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

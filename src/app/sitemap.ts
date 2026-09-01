import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Active business profiles + category browse URLs. Locality/category
 * combination landing pages (/mendoza/guaymallen/electricistas) aren't
 * built yet -- see "Designed for, not built yet" in docs/ARCHITECTURE.md --
 * so this only lists routes that actually exist today. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: businesses }, { data: categories }] = await Promise.all([
    supabase
      .from("businesses")
      .select("slug, updated_at")
      .eq("status", "active"),
    supabase.from("categories").select("slug"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/buscar`, changeFrequency: "daily", priority: 0.8 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url: `${siteUrl}/buscar?categoria=${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const businessRoutes: MetadataRoute.Sitemap = (businesses ?? []).map((b) => ({
    url: `${siteUrl}/negocios/${b.slug}`,
    lastModified: b.updated_at ? new Date(b.updated_at) : undefined,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...businessRoutes];
}

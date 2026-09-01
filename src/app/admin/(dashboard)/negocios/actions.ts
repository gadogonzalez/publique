"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";
import { businessFormSchema, type BusinessFormValues } from "@/lib/validations/business";
import type { BusinessStatus } from "@/lib/types/database";

export interface ActionResult {
  ok: boolean;
  error?: string;
  businessId?: string;
}

/**
 * Creates or updates a business plus every related table (categories,
 * services, service areas, keywords, hours, gallery). Writes run
 * sequentially with the admin's own session (RLS-enforced, not the
 * service-role key). Not wrapped in a DB transaction -- acceptable for an
 * admin-only, low-concurrency MVP; see docs/ARCHITECTURE.md "Known
 * tradeoffs" if this needs to become atomic later (a Postgres RPC function,
 * same pattern as search_businesses).
 */
export async function saveBusiness(raw: BusinessFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = businessFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const values = parsed.data;
  const supabase = await createClient();
  const businessId = values.id ?? randomUUID();

  const { error: businessError } = await supabase.from("businesses").upsert({
    id: businessId,
    name: values.name,
    slug: values.slug,
    short_description: values.short_description ?? null,
    long_description: values.long_description ?? null,
    logo_url: values.logo_url ?? null,
    cover_image_url: values.cover_image_url ?? null,
    whatsapp: values.whatsapp ?? null,
    phone: values.phone ?? null,
    email: values.email ?? null,
    website: values.website ?? null,
    instagram: values.instagram ?? null,
    address: values.address ?? null,
    latitude: values.latitude ?? null,
    longitude: values.longitude ?? null,
    location_id: values.location_id,
    status: values.status,
    plan_id: values.plan_id ?? null,
    featured: values.featured,
  });
  if (businessError) {
    if (businessError.code === "23505") {
      return { ok: false, error: "Ya existe un negocio con esa URL (slug)." };
    }
    return { ok: false, error: businessError.message };
  }

  const replaceRelation = async (
    table: string,
    rows: Record<string, unknown>[]
  ) => {
    const del = await supabase.from(table).delete().eq("business_id", businessId);
    if (del.error) throw del.error;
    if (rows.length > 0) {
      const ins = await supabase.from(table).insert(rows);
      if (ins.error) throw ins.error;
    }
  };

  try {
    await replaceRelation(
      "business_categories",
      values.category_ids.map((category_id, i) => ({
        business_id: businessId,
        category_id,
        is_primary: i === 0,
      }))
    );
    await replaceRelation(
      "business_services",
      values.service_ids.map((service_id) => ({ business_id: businessId, service_id }))
    );
    await replaceRelation(
      "business_service_areas",
      values.service_area_ids.map((location_id) => ({
        business_id: businessId,
        location_id,
      }))
    );
    await replaceRelation(
      "business_keywords",
      values.keywords.map((term) => ({ business_id: businessId, term }))
    );
    await replaceRelation(
      "business_images",
      values.gallery_urls.map((url, i) => ({
        business_id: businessId,
        url,
        sort_order: i,
      }))
    );
    await replaceRelation(
      "business_hours",
      values.hours.map((h) => ({ business_id: businessId, ...h }))
    );
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Error guardando datos relacionados",
    };
  }

  revalidatePath("/admin/negocios");
  revalidatePath(`/admin/negocios/${businessId}/editar`);
  revalidatePath("/buscar");
  return { ok: true, businessId };
}

export async function setBusinessStatus(
  id: string,
  status: BusinessStatus
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("businesses").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/negocios");
  return { ok: true };
}

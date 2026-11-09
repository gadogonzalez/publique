"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

const bannerSchema = z.object({
  businessId: z.string().uuid("Elegí un negocio"),
  desktopImageUrl: z.string().min(1, "Subí la imagen de escritorio"),
  mobileImageUrl: z.string().min(1, "Subí la imagen de celular"),
  altText: z.string().trim().max(300),
  sortOrder: z.coerce.number().int().min(0).max(999),
});

function refresh() {
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function createBanner(input: z.input<typeof bannerSchema>): Promise<ActionResult> {
  await requireAdmin();
  const parsed = bannerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };
  const { businessId, desktopImageUrl, mobileImageUrl, altText, sortOrder } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.from("home_banners").insert({
    business_id: businessId,
    desktop_image_url: desktopImageUrl,
    mobile_image_url: mobileImageUrl,
    alt_text: altText,
    sort_order: sortOrder,
  });
  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}

export async function setBannerActive(id: string, isActive: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("home_banners").update({ is_active: isActive }).eq("id", id);
  if (error) throw error;
  refresh();
}

export async function deleteBanner(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("home_banners").delete().eq("id", id);
  if (error) throw error;
  refresh();
}

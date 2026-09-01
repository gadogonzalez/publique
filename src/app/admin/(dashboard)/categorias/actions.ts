"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";
import { slugify } from "@/lib/utils";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function createCategory(name: string): Promise<ActionResult> {
  await requireAdmin();
  if (!name.trim()) return { ok: false, error: "Ingresá un nombre" };
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .insert({ name: name.trim(), slug: slugify(name) });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/categorias");
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    return {
      ok: false,
      error: "No se pudo borrar: hay servicios o negocios que usan esta categoría.",
    };
  }
  revalidatePath("/admin/categorias");
  return { ok: true };
}

export async function createService(name: string, categoryId: string): Promise<ActionResult> {
  await requireAdmin();
  if (!name.trim()) return { ok: false, error: "Ingresá un nombre" };
  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .insert({ name: name.trim(), slug: slugify(name), category_id: categoryId });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/categorias");
  return { ok: true };
}

export async function deleteService(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) {
    return { ok: false, error: "No se pudo borrar: hay negocios que usan este servicio." };
  }
  revalidatePath("/admin/categorias");
  return { ok: true };
}

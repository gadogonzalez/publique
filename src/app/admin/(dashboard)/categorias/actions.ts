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

/**
 * Keywords are global search aliases ("no sale agua" -> Bombas de agua),
 * scoped to exactly one service OR category (see 0003_taxonomy.sql,
 * docs/SEARCH.md). Growing this vocabulary from here (instead of only via
 * SQL) is what lets a non-engineer admin teach search new phrases.
 */
export async function createKeyword(
  term: string,
  target: { service_id?: string; category_id?: string }
): Promise<ActionResult> {
  await requireAdmin();
  const trimmed = term.trim().toLowerCase();
  if (!trimmed) return { ok: false, error: "Ingresá una palabra o frase" };
  if (!target.service_id && !target.category_id) {
    return { ok: false, error: "Falta el servicio o categoría de destino" };
  }
  const supabase = await createClient();

  let existing = supabase.from("keywords").select("id").eq("term", trimmed);
  existing = target.service_id
    ? existing.eq("service_id", target.service_id)
    : existing.eq("category_id", target.category_id!);
  const { data: dup } = await existing.maybeSingle();
  if (dup) return { ok: false, error: "Ese alias ya existe para este servicio/categoría." };

  const { error } = await supabase.from("keywords").insert({ term: trimmed, ...target });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/categorias");
  return { ok: true };
}

export async function deleteKeyword(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("keywords").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/categorias");
  return { ok: true };
}

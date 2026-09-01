import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AdminUser } from "@/lib/types/database";

/**
 * Verifies the current session belongs to an admin_users row. Middleware
 * already blocks unauthenticated requests to /admin/*; this additionally
 * confirms the signed-in Supabase user is actually staff (RLS on
 * admin_users means a non-admin can never read this row, so an empty
 * result reliably means "not an admin").
 */
export async function requireAdmin(): Promise<{
  userId: string;
  email: string | null;
  admin: AdminUser;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=not_admin");
  }

  return { userId: user.id, email: user.email ?? null, admin };
}

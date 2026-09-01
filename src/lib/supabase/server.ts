import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server client for Server Components / Server Actions / Route Handlers.
 * Runs with the signed-in user's own session, so RLS (including is_admin())
 * applies exactly as it would in the browser -- this is what admin writes
 * go through, not the service-role key.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component (no response to write cookies
            // to) -- safe to ignore because middleware refreshes sessions.
          }
        },
      },
    }
  );
}

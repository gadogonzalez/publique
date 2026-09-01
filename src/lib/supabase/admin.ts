import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client. Bypasses RLS entirely.
 *
 * Intentionally NOT used by the running app's admin panel (server actions
 * use src/lib/supabase/server.ts so RLS/is_admin() still applies). Reserved
 * for the seed script and any future trusted backend job (e.g. a webhook
 * handler) that genuinely needs to bypass RLS. Importing this from a client
 * component is a build-time error via the `server-only` package.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

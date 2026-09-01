import { cookies } from "next/headers";

export const SESSION_COOKIE = "pq_sid";

/**
 * Anonymous, non-identifying session id used only to correlate analytics
 * events (e.g. "this search led to this WhatsApp click") -- not an account.
 * Set by middleware.ts on every request; this just reads it back.
 */
export async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

import { createClient } from "@/lib/supabase/server";
import { getSessionId } from "@/lib/session";
import type { AnalyticsEvent } from "./types";

/**
 * Records an analytics event from a Server Component / Server Action /
 * Route Handler. Best-effort: a failed insert never breaks the page --
 * analytics must not be able to take down the product it's measuring.
 */
export async function trackServer(event: AnalyticsEvent): Promise<void> {
  try {
    const supabase = await createClient();
    const sessionId = await getSessionId();
    await supabase.from("analytics_events").insert({
      event_type: event.type,
      business_id: event.businessId ?? null,
      category_id: event.categoryId ?? null,
      location_id: event.locationId ?? null,
      search_query: event.searchQuery ?? null,
      session_id: sessionId,
      referrer: event.referrer ?? null,
      metadata: event.metadata ?? {},
    });
  } catch (err) {
    console.error("[analytics] trackServer failed", err);
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSessionId } from "@/lib/session";

const eventSchema = z.object({
  type: z.enum([
    "search_performed",
    "business_impression",
    "business_profile_view",
    "whatsapp_click",
    "phone_click",
    "directions_click",
    "website_click",
  ]),
  businessId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  locationId: z.string().uuid().optional(),
  searchQuery: z.string().max(200).optional(),
  referrer: z.string().max(500).optional(),
  metadata: z.record(z.unknown()).optional(),
});

/** Receives client-side analytics events (see src/lib/analytics/client.ts). */
export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = eventSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = parsed.data;
  const supabase = await createClient();
  const sessionId = await getSessionId();

  const { error } = await supabase.from("analytics_events").insert({
    event_type: event.type,
    business_id: event.businessId ?? null,
    category_id: event.categoryId ?? null,
    location_id: event.locationId ?? null,
    search_query: event.searchQuery ?? null,
    session_id: sessionId,
    referrer: event.referrer ?? null,
    metadata: event.metadata ?? {},
  });

  if (error) {
    console.error("[analytics] insert failed", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

/**
 * Every event the product currently emits. analytics_events.event_type is
 * plain text in the DB (see 0008_analytics_events.sql) so new types can be
 * added here without a migration -- this union is the real source of truth
 * for "what events exist".
 */
export type AnalyticsEventType =
  | "search_performed"
  | "business_impression"
  | "business_profile_view"
  | "whatsapp_click"
  | "phone_click"
  | "directions_click"
  | "website_click";

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  businessId?: string;
  categoryId?: string;
  locationId?: string;
  searchQuery?: string;
  referrer?: string;
  metadata?: Record<string, unknown>;
}

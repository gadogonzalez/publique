"use client";

import type { AnalyticsEvent } from "./types";

/**
 * Fire-and-forget event tracking from client components (CTA clicks like
 * WhatsApp/phone/directions/website, where the interaction only exists in
 * the browser). Never awaited by callers, never throws.
 */
export function trackClient(event: AnalyticsEvent): void {
  try {
    const body = JSON.stringify(event);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/analytics",
        new Blob([body], { type: "application/json" })
      );
      return;
    }
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Never let analytics break a user-facing interaction.
  }
}

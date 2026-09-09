"use client";

import { MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackClient } from "@/lib/analytics/client";
import { formatWhatsAppLink, getMapsUrl } from "@/lib/utils";

/** Mobile-only bottom bar for the PDP's primary conversion action.
 * WhatsApp is the preferred contact method; directions is the secondary
 * action. No phone/call CTA (see redesign report -- avoids unnecessary
 * contact exposure). Desktop already shows the full CtaButtons row inline. */
export function StickyContactBar({
  businessId,
  businessName,
  whatsapp,
  address,
  latitude,
  longitude,
}: {
  businessId: string;
  businessName: string;
  whatsapp?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}) {
  const mapsUrl = getMapsUrl(address, latitude, longitude);
  if (!whatsapp && !mapsUrl) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-border bg-card p-3 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] sm:hidden">
      {whatsapp && (
        <Button
          asChild
          variant="whatsapp"
          className="flex-1"
          onClick={() => trackClient({ type: "whatsapp_click", businessId })}
        >
          <a
            href={formatWhatsAppLink(
              whatsapp,
              `Hola ${businessName}, te encontré en Publique.`
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </Button>
      )}
      {mapsUrl && (
        <Button
          asChild
          variant="outline"
          className="flex-1"
          onClick={() => trackClient({ type: "directions_click", businessId })}
        >
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
            <MapPin className="h-4 w-4" />
            Cómo llegar
          </a>
        </Button>
      )}
    </div>
  );
}

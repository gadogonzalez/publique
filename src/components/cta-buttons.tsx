"use client";

import { MapPin, MessageCircle, Phone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackClient } from "@/lib/analytics/client";
import { formatTelLink, formatWhatsAppLink } from "@/lib/utils";

interface CtaButtonsProps {
  businessId: string;
  businessName: string;
  whatsapp?: string | null;
  phone?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  website?: string | null;
  size?: "default" | "sm" | "lg";
  className?: string;
}

/** The obvious-action row: WhatsApp / call / directions, used on both the
 * search results card and the profile page. Every click is tracked. */
export function CtaButtons({
  businessId,
  businessName,
  whatsapp,
  phone,
  address,
  latitude,
  longitude,
  website,
  size = "default",
  className,
}: CtaButtonsProps) {
  const mapsUrl =
    latitude != null && longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
        : null;

  return (
    <div className={className ? className : "flex flex-wrap gap-2"}>
      {whatsapp && (
        <Button
          asChild
          variant="whatsapp"
          size={size}
          onClick={() =>
            trackClient({ type: "whatsapp_click", businessId })
          }
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
      {phone && (
        <Button
          asChild
          variant="outline"
          size={size}
          onClick={() => trackClient({ type: "phone_click", businessId })}
        >
          <a href={formatTelLink(phone)}>
            <Phone className="h-4 w-4" />
            Llamar
          </a>
        </Button>
      )}
      {mapsUrl && (
        <Button
          asChild
          variant="outline"
          size={size}
          onClick={() => trackClient({ type: "directions_click", businessId })}
        >
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
            <MapPin className="h-4 w-4" />
            Cómo llegar
          </a>
        </Button>
      )}
      {website && (
        <Button
          asChild
          variant="ghost"
          size={size}
          onClick={() => trackClient({ type: "website_click", businessId })}
        >
          <a href={website} target="_blank" rel="noopener noreferrer">
            <Globe className="h-4 w-4" />
            Sitio web
          </a>
        </Button>
      )}
    </div>
  );
}

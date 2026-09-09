"use client";

import { MapPin, MessageCircle, Phone, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
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
  /** "compact": WhatsApp stays a real button, everything else becomes a
   * plain text link. Used in listing rows so a page of results isn't a
   * wall of identically-bordered buttons. */
  variant?: "default" | "compact";
  className?: string;
}

/** The obvious-action row: WhatsApp / call / directions, used on both
 * search results and the profile page. Every click is tracked. */
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
  variant = "default",
  className,
}: CtaButtonsProps) {
  const mapsUrl =
    latitude != null && longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
        : null;

  const linkClass =
    "inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground";

  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2", className)}>
      {whatsapp && (
        <Button
          asChild
          variant="whatsapp"
          size={size}
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

      {variant === "compact" ? (
        <>
          {phone && (
            <a
              href={formatTelLink(phone)}
              className={linkClass}
              onClick={() => trackClient({ type: "phone_click", businessId })}
            >
              <Phone className="h-3.5 w-3.5" />
              Llamar
            </a>
          )}
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
              onClick={() => trackClient({ type: "directions_click", businessId })}
            >
              <MapPin className="h-3.5 w-3.5" />
              Cómo llegar
            </a>
          )}
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

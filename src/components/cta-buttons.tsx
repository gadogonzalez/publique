"use client";

import { useState } from "react";
import { Check, MapPin, MessageCircle, Phone, Globe, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackClient } from "@/lib/analytics/client";
import { cn, formatTelLink, formatWhatsAppLink, getMapsUrl } from "@/lib/utils";

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
  const mapsUrl = getMapsUrl(address, latitude, longitude);

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
              `Hola ${businessName}, te encontré en Publiqué.`
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

/** Plain-text external link on the profile (address, website), tracked
 * with the same event as its button counterpart. */
export function TrackedLink({
  businessId,
  event,
  href,
  className,
  children,
}: {
  businessId: string;
  event: "directions_click" | "website_click";
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackClient({ type: event, businessId })}
    >
      {children}
    </a>
  );
}

/** Share the current profile: native share sheet on phones, copy-link
 * fallback elsewhere. Tracked as share_click with the method used. */
export function ShareButton({ businessId, businessName }: { businessId: string; businessName: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: businessName, text: `${businessName} en Publiqué`, url });
        trackClient({ type: "share_click", businessId, metadata: { method: "native" } });
      } catch {
        // user dismissed the share sheet -- nothing to do
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackClient({ type: "share_click", businessId, metadata: { method: "copy" } });
    } catch {
      // clipboard blocked -- nothing sensible to fall back to
    }
  }

  return (
    <Button type="button" variant="outline" onClick={handleShare} aria-live="polite">
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Link copiado" : "Compartir"}
    </Button>
  );
}

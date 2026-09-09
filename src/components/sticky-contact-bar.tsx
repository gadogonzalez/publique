"use client";

import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackClient } from "@/lib/analytics/client";
import { formatTelLink, formatWhatsAppLink } from "@/lib/utils";

/** Mobile-only bottom bar for the two actions that matter most when
 * someone lands here urgently: WhatsApp and a call. Desktop already shows
 * the full CtaButtons row inline. */
export function StickyContactBar({
  businessId,
  businessName,
  whatsapp,
  phone,
}: {
  businessId: string;
  businessName: string;
  whatsapp?: string | null;
  phone?: string | null;
}) {
  if (!whatsapp && !phone) return null;

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
      {phone && (
        <Button
          asChild
          variant="outline"
          className="flex-1"
          onClick={() => trackClient({ type: "phone_click", businessId })}
        >
          <a href={formatTelLink(phone)}>
            <Phone className="h-4 w-4" />
            Llamar
          </a>
        </Button>
      )}
    </div>
  );
}

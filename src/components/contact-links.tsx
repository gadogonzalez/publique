import { Instagram, Mail, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SITE_CONTACT, hasContactChannel } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Publiqué's own contact buttons (not a business's). Shared by /nosotros
 * and /para-negocios; renders only the channels configured in env. */
export function ContactLinks({ className }: { className?: string }) {
  const { whatsappUrl, email, instagramUrl } = SITE_CONTACT;

  if (!hasContactChannel && !instagramUrl) {
    return (
      <p className={cn("text-muted-foreground", className)}>
        Estamos sumando nuestros canales de contacto. Mientras tanto, explorá los negocios de tu zona.
      </p>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "whatsapp" }))}
        >
          <MessageCircle className="h-4 w-4" />
          Escribinos por WhatsApp
        </a>
      )}
      {email && (
        <a href={`mailto:${email}`} className={cn(buttonVariants({ variant: "outline" }))}>
          <Mail className="h-4 w-4" />
          {email}
        </a>
      )}
      {instagramUrl && (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <Instagram className="h-4 w-4" />
          Instagram
        </a>
      )}
    </div>
  );
}

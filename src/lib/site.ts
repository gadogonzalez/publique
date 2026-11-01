import { formatWhatsAppLink } from "@/lib/utils";

/** Publiqué's own contact/social channels. Set in the environment (Vercel
 * project settings) -- anything unset is simply not rendered, so the UI
 * never shows a fake or dead link. */
const whatsapp = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || null;
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || null;

export const SITE_CONTACT = {
  whatsappUrl: whatsapp ? formatWhatsAppLink(whatsapp, "Hola Publiqué, quería hacerles una consulta.") : null,
  email,
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || null,
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL || null,
};

export const hasContactChannel = !!(SITE_CONTACT.whatsappUrl || SITE_CONTACT.email);

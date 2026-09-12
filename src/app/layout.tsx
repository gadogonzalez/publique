import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getLocalities } from "@/lib/data/locations";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Publique — Encontrá negocios y servicios cerca tuyo",
    template: "%s | Publique",
  },
  description:
    "Publique te ayuda a encontrar negocios, profesionales y servicios locales en Guaymallén, Mendoza. Contactá por WhatsApp en un toque.",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Publique",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localities = await getLocalities();

  return (
    <html lang="es-AR">
      <body className="flex min-h-screen flex-col antialiased">
        <SiteHeader localities={localities} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

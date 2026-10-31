import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCategories } from "@/lib/data/taxonomy";

// Brand manual §05: Poppins (ExtraBold/SemiBold/Regular). Self-hosted via
// next/font (no runtime Google Fonts request), exposed as --font-poppins
// and consumed by the existing --font-serif token in globals.css -- kept
// under that name so the font-serif utility already used across every
// component doesn't need a sitewide rename.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Publiqué — Encontrá negocios y servicios cerca tuyo",
    template: "%s | Publiqué",
  },
  description:
    "Publiqué te ayuda a encontrar negocios, profesionales y servicios locales en Guaymallén, Mendoza. Contactá por WhatsApp en un toque.",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Publiqué",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <html lang="es-AR" className={poppins.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        <SiteHeader categories={categories} />
        <main className="flex-1 pt-20">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

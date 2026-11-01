import type { Metadata } from "next";
import { ContactLinks } from "@/components/contact-links";
import { HERO_GRID } from "@/components/home/width";
import { hasContactChannel, SITE_CONTACT } from "@/lib/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escribinos: consultas, sumar tu negocio o avisarnos de un dato incorrecto.",
};

interface ContactoPageProps {
  searchParams: Promise<{ motivo?: string }>;
}

export default async function ContactoPage({ searchParams }: ContactoPageProps) {
  const { motivo } = await searchParams;
  const defaultReason = motivo === "negocio" || motivo === "error" ? motivo : "consulta";

  return (
    <div className={`${HERO_GRID} py-8`}>
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">Contacto</h1>
        <p className="mt-2 text-muted-foreground">
          ¿Tenés una consulta, querés sumar tu negocio o encontraste un dato incorrecto? Escribinos y te
          respondemos por email.
        </p>

        <div className="mt-8">
          <ContactForm defaultReason={defaultReason} />
        </div>

        {(hasContactChannel || SITE_CONTACT.instagramUrl) && (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="font-serif text-2xl font-bold tracking-tight">Otras formas de contactarnos</h2>
            <ContactLinks className="mt-5" />
          </section>
        )}
      </div>
    </div>
  );
}

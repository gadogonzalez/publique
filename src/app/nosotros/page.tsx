import type { Metadata } from "next";
import Link from "next/link";
import { ContactLinks } from "@/components/contact-links";
import { HERO_GRID } from "@/components/home/width";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Qué es Publiqué y cómo contactarnos.",
};

export default function NosotrosPage() {
  return (
    <div className={`${HERO_GRID} py-8`}>
      <div className="max-w-2xl">
        <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">Quiénes somos</h1>
        <div className="mt-4 space-y-4 text-muted-foreground">
          <p>
            Publiqué es una guía de negocios y servicios de Guaymallén, Mendoza. La armamos para que
            encontrar un plomero, una veterinaria o una vianda cerca tuyo sea tan simple como buscarlo y
            escribirle por WhatsApp.
          </p>
          <p>
            Muchos comercios y profesionales del barrio trabajan bien pero no aparecen en internet, o solo
            se los conoce por grupos de WhatsApp y Facebook. Publiqué les da un perfil claro, con su
            ubicación, horarios y contacto directo.
          </p>
        </div>
        <Link href="/buscar" className="mt-6 inline-block font-medium text-brand-primary hover:underline">
          Explorar negocios
        </Link>

        <section id="contacto" className="mt-12 scroll-mt-28 border-t border-border pt-10">
          <h2 className="font-serif text-xl font-bold tracking-tight">Contacto</h2>
          <p className="mt-2 text-muted-foreground">
            ¿Tenés una consulta, una sugerencia o encontraste un dato incorrecto? Escribinos.
          </p>
          <ContactLinks className="mt-5" />
        </section>
      </div>
    </div>
  );
}

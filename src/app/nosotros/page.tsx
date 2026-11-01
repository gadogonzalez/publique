import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { HERO_GRID } from "@/components/home/width";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description: "Qué es Publiqué y cómo funciona.",
};

const STEPS = [
  { title: "Buscá lo que necesitás", body: "Escribí qué buscás o elegí una categoría y tu zona." },
  { title: "Elegí un negocio", body: "Mirá su perfil: ubicación, horarios, servicios y fotos." },
  { title: "Escribile directo", body: "Contactalo por WhatsApp o pedí cómo llegar, sin intermediarios." },
];

export default function NosotrosPage() {
  return (
    <div className={`${HERO_GRID} py-8`}>
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">Quiénes somos</h1>
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
      </div>

      <section className="mt-16 sm:mt-20">
        <h2 className="font-serif text-2xl font-bold tracking-tight">Cómo funciona</h2>
        <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-border bg-card p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary-soft text-sm font-bold text-brand-primary">
                {i + 1}
              </span>
              <h3 className="mt-3 font-serif text-lg font-bold tracking-tight">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/buscar" className={buttonVariants({ variant: "brand" })}>
            Explorar negocios
          </Link>
          <Link href="/contacto" className={buttonVariants({ variant: "outline" })}>
            Contactanos
          </Link>
        </div>
      </section>
    </div>
  );
}

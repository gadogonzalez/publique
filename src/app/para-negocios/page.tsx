import type { Metadata } from "next";
import { Check } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HERO_GRID } from "@/components/home/width";
import { getPlans } from "@/lib/data/plans";

export const metadata: Metadata = {
  title: "Para negocios",
  description: "Cómo sumar tu negocio a Publiqué, planes y preguntas frecuentes.",
};

const ars = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

const STEPS = [
  { title: "Nos pasás tus datos", body: "Nombre, WhatsApp, rubro y localidad. Con eso ya podemos armar tu perfil." },
  { title: "Publicamos tu perfil", body: "Con ubicación, horarios, servicios y fotos según tu plan." },
  { title: "Te escriben directo", body: "Los clientes te contactan por WhatsApp o te encuentran en el mapa." },
];

const FAQ = [
  {
    q: "¿Cómo me contactan los clientes?",
    a: "Desde tu perfil, con un botón que abre WhatsApp directo con vos, y otro que les muestra cómo llegar. Publiqué no intermedia: el mensaje te llega a vos.",
  },
  {
    q: "¿Qué datos necesito para publicar?",
    a: "Nombre del negocio, un WhatsApp o teléfono, tu rubro y la localidad. Después podés sumar descripción, horarios, servicios y fotos.",
  },
  {
    q: "¿Cómo aparezco como destacado?",
    a: "Los negocios con plan pago que tienen logo y foto de portada pueden aparecer en las secciones de destacados de la página de inicio y de su categoría.",
  },
  {
    q: "¿Puedo cambiar mis datos después?",
    a: "Sí. Escribinos con lo que quieras actualizar y lo cambiamos.",
  },
  {
    q: "¿En qué zonas funciona Publiqué?",
    a: "Por ahora en las localidades de Guaymallén, Mendoza.",
  },
];

export default async function ParaNegociosPage() {
  const plans = await getPlans();

  return (
    <div className={`${HERO_GRID} py-8`}>
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">Sumá tu negocio a Publiqué</h1>
        <p className="mt-2 text-muted-foreground">
          Que los vecinos de tu zona te encuentren cuando buscan lo que hacés, y te escriban directo por WhatsApp.
        </p>
      </div>

      <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <li key={step.title} className="rounded-2xl border border-border bg-card p-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary-soft text-sm font-bold text-brand-primary">
              {i + 1}
            </span>
            <h2 className="mt-3 font-serif text-lg font-bold tracking-tight">{step.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>

      {plans.length > 0 && (
        <section id="planes" className="mt-16 scroll-mt-28 sm:mt-20">
          <h2 className="font-serif text-2xl font-bold tracking-tight">Planes y precios</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.id} className="flex flex-col rounded-2xl border border-border bg-card p-6">
                <h3 className="font-serif text-lg font-bold tracking-tight">{plan.name}</h3>
                <p className="mt-1 text-2xl font-bold">
                  {plan.is_free || !plan.price_ars ? "Gratis" : ars.format(plan.price_ars)}
                </p>
                {plan.description && <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>}
                {plan.features.length > 0 && (
                  <ul className="mt-4 space-y-2 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="preguntas" className="mt-16 max-w-2xl scroll-mt-28 sm:mt-20">
        <h2 className="font-serif text-2xl font-bold tracking-tight">Preguntas frecuentes</h2>
        <div className="mt-4 divide-y divide-border border-y border-border">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {q}
                <span aria-hidden className="text-xl leading-none text-muted-foreground group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-16 max-w-2xl rounded-2xl bg-brand-primary-soft p-6 sm:mt-20 sm:p-8">
        <h2 className="font-serif text-2xl font-bold tracking-tight">¿Querés sumar tu negocio?</h2>
        <p className="mt-2 text-muted-foreground">Escribinos y te ayudamos a armar tu perfil.</p>
        <Link href="/contacto?motivo=negocio" className={cn(buttonVariants({ variant: "brand" }), "mt-5")}>
          Escribinos
        </Link>
      </section>
    </div>
  );
}

import Link from "next/link";
import { getCategories } from "@/lib/data/taxonomy";
import { getPrimaryMarket } from "@/lib/data/locations";
import { getFeaturedSlotsForCategory, getFeaturedEligibleBusinesses } from "@/lib/data/featured";
import { FeaturedManager } from "@/components/admin/featured-manager";

interface DestacadosPageProps {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function DestacadosPage({ searchParams }: DestacadosPageProps) {
  const { categoria } = await searchParams;
  const [categories, market] = await Promise.all([getCategories(), getPrimaryMarket()]);

  if (!market) {
    return (
      <div>
        <h1 className="mb-2 text-xl font-bold">Negocios destacados</h1>
        <p className="text-sm text-muted-foreground">
          Falta configurar el departamento (mercado) en Ubicaciones antes de poder asignar
          destacados.
        </p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div>
        <h1 className="mb-2 text-xl font-bold">Negocios destacados</h1>
        <p className="text-sm text-muted-foreground">Creá una categoría primero.</p>
      </div>
    );
  }

  const selected = categories.find((c) => c.slug === categoria) ?? categories[0]!;

  const [slots, eligibleBusinesses] = await Promise.all([
    getFeaturedSlotsForCategory(selected.id, market.id),
    getFeaturedEligibleBusinesses(selected.id),
  ]);

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold">Negocios destacados</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Mercado: {market.name}. Elegí una categoría para gestionar su destacado principal y sus
        hasta 4 destacados secundarios.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/admin/destacados?categoria=${c.slug}`}
            className={`rounded-full border px-3 py-1 text-sm ${
              c.id === selected.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <FeaturedManager
        category={selected}
        market={market}
        slots={slots}
        eligibleBusinesses={eligibleBusinesses}
        now={new Date().getTime()}
      />
    </div>
  );
}

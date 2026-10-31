import Image from "next/image";
import Link from "next/link";
import type { BusinessWithRelations } from "@/lib/types/database";

/** Homepage promo slot: one manually-curated "negocio destacado" banner
 * (a real image, not generated from data) linking to that business's real
 * profile. Same idea as assigning a destacado principal in a category --
 * swap the image/business here to feature someone else. */
export function PromoBanner({ business }: { business: BusinessWithRelations | null }) {
  if (!business) return null;

  return (
    <Link href={`/negocios/${business.slug}`} className="group block overflow-hidden rounded-2xl">
      <Image
        src="/promo/patitas-pet-shop-banner.webp"
        alt={business.name}
        width={2000}
        height={460}
        sizes="100vw"
        className="w-full transition-transform duration-500 group-hover:scale-[1.01]"
      />
    </Link>
  );
}

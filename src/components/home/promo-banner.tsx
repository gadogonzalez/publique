import { getImageProps } from "next/image";
import Link from "next/link";
import type { BusinessWithRelations } from "@/lib/types/database";

/** Homepage promo slot: one manually-curated "negocio destacado" banner
 * (a real image, not generated from data) linking to that business's real
 * profile. Art-directed: a vertical version below `sm` (the wide one is
 * unreadable at phone width), the wide one above. Swap both images and
 * the business here to feature someone else. */
export function PromoBanner({ business }: { business: BusinessWithRelations | null }) {
  if (!business) return null;

  const alt = `${business.name}: todo lo que tu mascota necesita. Alimentos, accesorios, higiene y mucho más.`;
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    alt,
    src: "/promo/patitas-pet-shop-banner.webp",
    width: 2000,
    height: 460,
    sizes: "100vw",
  });
  const { props: mobileProps } = getImageProps({
    alt,
    src: "/promo/patitas-pet-shop-banner-mobile.webp",
    width: 724,
    height: 986,
    sizes: "100vw",
  });

  return (
    <Link href={`/negocios/${business.slug}`} className="group block overflow-hidden rounded-2xl">
      <picture>
        <source media="(min-width: 640px)" srcSet={desktopSrcSet} />
        <img
          {...mobileProps}
          alt={alt}
          className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.01]"
        />
      </picture>
    </Link>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FeaturedCarouselCard } from "@/components/home/featured-carousel-card";
import { cn } from "@/lib/utils";
import type { BusinessWithRelations } from "@/lib/types/database";

// "Page" here means one arrow click / one dot, sized to the desktop
// 4-cards-per-page spec -- the actual number of cards a click moves past
// scales naturally with viewport width (4 on desktop, fewer on tablet,
// one swipe on mobile) since it scrolls by exactly one container width.
const CARDS_PER_PAGE = 4;

function reducedMotionPreferred() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Self-contained "Negocios destacados" section: heading + subtitle,
 * circular prev/next arrows next to the heading, the card track itself
 * (CSS scroll-snap, native swipe on mobile, no library), pagination dots,
 * and the existing "Ver todos los negocios" link. No autoplay, no loop. */
export function FeaturedDestacadosCarousel({
  businesses,
}: {
  businesses: BusinessWithRelations[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(businesses.length / CARDS_PER_PAGE));

  const syncPageFromScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 1) {
      setPage(0);
      return;
    }
    const ratio = el.scrollLeft / maxScroll;
    setPage(Math.round(ratio * (totalPages - 1)));
  }, [totalPages]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let frame = 0;
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncPageFromScroll);
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [syncPageFromScroll]);

  function goTo(targetPage: number) {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(totalPages - 1, targetPage));
    const maxScroll = el.scrollWidth - el.clientWidth;
    const left = totalPages > 1 ? (maxScroll * clamped) / (totalPages - 1) : 0;
    el.scrollTo({ left, behavior: reducedMotionPreferred() ? "auto" : "smooth" });
    setPage(clamped);
  }

  const atStart = page <= 0;
  const atEnd = page >= totalPages - 1;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold tracking-tight">Negocios destacados</h2>
        {totalPages > 1 && (
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              aria-label="Página anterior"
              disabled={atStart}
              onClick={() => goTo(page - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Página siguiente"
              disabled={atEnd}
              onClick={() => goTo(page + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-40"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <p className="mb-6 text-muted-foreground">
        Conocé una selección de negocios destacados de Guaymallén.
      </p>

      <div
        ref={trackRef}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1 motion-safe:scroll-smooth sm:mx-0 sm:gap-6 sm:px-0"
      >
        {businesses.map((business) => (
          <div key={business.id} className="w-[85%] shrink-0 snap-start sm:w-[46%] lg:w-[calc(25%-18px)]">
            <FeaturedCarouselCard business={business} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 hidden items-center justify-center gap-2 sm:flex">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir a la página ${i + 1}`}
              aria-current={page === i}
              onClick={() => goTo(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                page === i ? "w-6 bg-brand-primary" : "w-2 bg-border hover:bg-muted-foreground/40"
              )}
            />
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link
          href="/buscar"
          className="flex items-center gap-1 text-sm font-medium hover:text-brand-primary"
        >
          Ver todos los negocios <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

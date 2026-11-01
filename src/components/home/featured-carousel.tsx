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
  title = "Negocios destacados",
  description = "Conocé una selección de negocios destacados de Guaymallén.",
  moreHref = "/buscar",
  moreLabel = "Ver todos los negocios",
}: {
  businesses: BusinessWithRelations[];
  title?: string;
  description?: string;
  moreHref?: string;
  moreLabel?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const totalPages = Math.max(1, Math.ceil(businesses.length / CARDS_PER_PAGE));

  const syncFromScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= maxScroll - 1);
    setPage(maxScroll <= 1 ? 0 : Math.round((el.scrollLeft / maxScroll) * (totalPages - 1)));
  }, [totalPages]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncFromScroll();
    let frame = 0;
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncFromScroll);
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [syncFromScroll]);

  const behavior = () => (reducedMotionPreferred() ? "auto" : "smooth") as ScrollBehavior;

  // Arrows move one visible width (1 card on mobile, 4 on desktop); snap
  // settles on the next card start.
  function step(dir: 1 | -1) {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: behavior() });
  }

  function goTo(targetPage: number) {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const left = totalPages > 1 ? (maxScroll * targetPage) / (totalPages - 1) : 0;
    el.scrollTo({ left, behavior: behavior() });
  }

  const arrowClass =
    "flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-40";

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-4">
        <h2 className="font-serif text-2xl font-bold tracking-tight">{title}</h2>
        {businesses.length > 1 && !(atStart && atEnd) && (
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" aria-label="Anteriores" disabled={atStart} onClick={() => step(-1)} className={arrowClass}>
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Siguientes" disabled={atEnd} onClick={() => step(1)} className={arrowClass}>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <p className="mb-6 text-muted-foreground">{description}</p>

      <div
        ref={trackRef}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 py-1 motion-safe:scroll-smooth sm:-mx-6 sm:scroll-px-6 sm:gap-6 sm:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8 xl:-mx-10 xl:scroll-px-10 xl:px-10 2xl:-mx-12 2xl:scroll-px-12 2xl:px-12"
      >
        {businesses.map((business) => (
          <div key={business.id} className="w-[85%] shrink-0 snap-start sm:w-[46%] lg:w-[calc(25%-18px)]">
            <FeaturedCarouselCard business={business} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 hidden items-center justify-center lg:flex">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir a la página ${i + 1}`}
              aria-current={page === i}
              onClick={() => goTo(i)}
              className="group flex h-11 items-center px-1.5"
            >
              <span
                className={cn(
                  "block h-2 rounded-full transition-all",
                  page === i ? "w-6 bg-brand-primary" : "w-2 bg-border group-hover:bg-muted-foreground/40"
                )}
              />
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Link
          href={moreHref}
          className="flex items-center gap-1 text-sm font-medium hover:text-brand-primary"
        >
          {moreLabel} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

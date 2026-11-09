"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HomeBannerSlide {
  id: string;
  href: string;
  alt: string;
  desktopSrc: string;
  mobileSrc: string;
}

// Nominal sizes (recommended upload sizes, see /admin/banners); the real
// aspect ratio comes from the image itself once loaded (h-auto).
const DESKTOP = { width: 2000, height: 460 };
const MOBILE = { width: 750, height: 1020 };

function Slide({ slide, priority }: { slide: HomeBannerSlide; priority: boolean }) {
  const common = { alt: slide.alt, sizes: "100vw", priority };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: slide.desktopSrc, ...DESKTOP });
  const { props: mobileProps } = getImageProps({ ...common, src: slide.mobileSrc, ...MOBILE });

  return (
    <Link href={slide.href} className="group block overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
      <picture>
        <source media="(min-width: 640px)" srcSet={desktopSrcSet} />
        <img
          {...mobileProps}
          alt={slide.alt}
          className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.01]"
        />
      </picture>
    </Link>
  );
}

/** Premium homepage banners. One banner renders as a plain link; several
 * become a swipeable carousel with arrows and dots. No autoplay. */
export function HomeBanners({ slides }: { slides: HomeBannerSlide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (el) setIndex(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [sync]);

  const first = slides[0];
  if (!first) return null;
  if (slides.length === 1) return <Slide slide={first} priority={false} />;

  function goTo(i: number) {
    const el = trackRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: i * el.clientWidth, behavior: reduced ? "auto" : "smooth" });
  }

  const arrowClass =
    "absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow transition-colors hover:bg-white disabled:opacity-0 sm:flex";

  return (
    <div role="region" aria-roledescription="carrusel" aria-label="Negocios Premium">
      <div className="relative">
        <div ref={trackRef} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className="w-full shrink-0 snap-start"
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${slides.length}`}
            >
              <Slide slide={slide} priority={false} />
            </div>
          ))}
        </div>
        <button type="button" aria-label="Banner anterior" disabled={index === 0} onClick={() => goTo(index - 1)} className={cn(arrowClass, "left-3")}>
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Banner siguiente" disabled={index >= slides.length - 1} onClick={() => goTo(index + 1)} className={cn(arrowClass, "right-3")}>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2 flex justify-center">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Ir al banner ${i + 1}`}
            aria-current={index === i}
            onClick={() => goTo(i)}
            className="group flex h-11 items-center px-1.5"
          >
            <span
              className={cn(
                "block h-2 rounded-full transition-all",
                index === i ? "w-6 bg-brand-primary" : "w-2 bg-border group-hover:bg-muted-foreground/40"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

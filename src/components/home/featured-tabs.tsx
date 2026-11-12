"use client";

import { useState } from "react";
import { FeaturedDestacadosCarousel } from "@/components/home/featured-carousel";
import { cn } from "@/lib/utils";
import type { BusinessWithRelations } from "@/lib/types/database";

export interface FeaturedTab {
  id: string;
  label: string;
  moreHref: string;
  moreLabel: string;
  businesses: BusinessWithRelations[];
}

/** Homepage destacados with a row of category filters ("Todas" + the most
 * searched categories). Switching a filter swaps the carousel's cards. */
export function FeaturedTabs({ tabs }: { tabs: FeaturedTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];
  if (!active) return null;

  const toolbar =
    tabs.length > 1 ? (
      <div
        role="group"
        aria-label="Filtrar destacados por categoría"
        className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-pressed={tab.id === active.id}
            onClick={() => setActiveId(tab.id)}
            className={cn(
              "h-11 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
              tab.id === active.id
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:border-brand-primary"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    ) : null;

  return (
    <FeaturedDestacadosCarousel
      key={active.id}
      businesses={active.businesses}
      moreHref={active.moreHref}
      moreLabel={active.moreLabel}
      toolbar={toolbar}
      showCategory={active.id === "todas"}
    />
  );
}

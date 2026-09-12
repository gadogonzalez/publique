"use client";

import { useMemo, useState } from "react";
import { FeaturedBusinessCard } from "@/components/home/featured-business-card";
import { MotionReveal } from "@/components/home/motion-reveal";
import { cn } from "@/lib/utils";
import type { BusinessWithRelations } from "@/lib/types/database";

const TABS = [
  { key: "todos", label: "Todos" },
  { key: "recientes", label: "Más recientes" },
  { key: "relevantes", label: "Más relevantes" },
] as const;

type SortKey = (typeof TABS)[number]["key"];

/** Re-sorts the already-fetched, already-relevance-ranked page of
 * businesses client-side -- no extra query, no backend sort added. */
export function BusinessDiscoveryGrid({
  businesses,
}: {
  businesses: BusinessWithRelations[];
}) {
  const [sort, setSort] = useState<SortKey>("todos");

  const sorted = useMemo(() => {
    if (sort === "recientes") {
      return [...businesses].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return businesses;
  }, [businesses, sort]);

  return (
    <div>
      <div className="mb-6 flex gap-5 text-sm">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setSort(tab.key)}
            className={cn(
              "font-medium",
              sort === tab.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((business, i) => {
          const featured = sort === "todos" && i === 0;
          return (
            <MotionReveal
              key={business.id}
              delay={(i % 3) * 80}
              className={featured ? "sm:col-span-2 sm:row-span-2" : undefined}
            >
              <FeaturedBusinessCard business={business} featured={featured} />
            </MotionReveal>
          );
        })}
      </div>
    </div>
  );
}

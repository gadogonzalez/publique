"use client";

import { useMemo, useState } from "react";
import { FeaturedBusinessCard } from "@/components/home/featured-business-card";
import { BusinessListRow } from "@/components/home/business-list-row";
import { MotionReveal } from "@/components/home/motion-reveal";
import { cn } from "@/lib/utils";
import type { BusinessWithRelations } from "@/lib/types/database";

const TABS = [
  { key: "todos", label: "Todos" },
  { key: "recientes", label: "Más recientes" },
  { key: "relevantes", label: "Más relevantes" },
] as const;

type SortKey = (typeof TABS)[number]["key"];

const FEATURED_COUNT = 3;

/** Re-sorts the already-fetched, already-relevance-ranked page of
 * businesses client-side -- no extra query, no backend sort added. The
 * first 3 render as photo cards ("destacados"); the rest render as a
 * compact, booking-style horizontal list below them. */
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

  const featured = sorted.slice(0, FEATURED_COUNT);
  const rest = sorted.slice(FEATURED_COUNT);

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

      {featured.length > 0 && (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3">
          {featured.map((business, i) => (
            <MotionReveal key={business.id} delay={i * 80}>
              <FeaturedBusinessCard business={business} />
            </MotionReveal>
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div className={cn(featured.length > 0 && "mt-10")}>
          {rest.map((business) => (
            <BusinessListRow key={business.id} business={business} />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { BusinessCard } from "@/components/business-card";
import { Reveal } from "@/components/reveal";
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
      <div className="mb-5 flex gap-4 text-sm">
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

      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {sorted.map((business, i) => (
          <Reveal key={business.id} delay={(i % 4) * 60}>
            <BusinessCard business={business} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

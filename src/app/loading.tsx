import { HERO_GRID } from "@/components/home/width";

/** Generic skeleton shown while a public route's server data loads. */
export default function Loading() {
  return (
    <div className={`${HERO_GRID} py-8`} aria-busy="true" aria-live="polite">
      <span className="sr-only">Cargando…</span>
      <div className="h-8 w-64 max-w-full animate-pulse rounded-lg bg-muted motion-reduce:animate-none" />
      <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-muted motion-reduce:animate-none" />
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-muted motion-reduce:animate-none" />
        ))}
      </div>
    </div>
  );
}

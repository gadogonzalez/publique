"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

/** /buscar's query box. Same look and placeholder as the homepage hero bar;
 * keeps the active categoria/zona filters when the query changes (zone is
 * picked with the filters next to the results). */
export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) params.set("q", value.trim());
    else params.delete("q");
    params.delete("page");
    router.push(`/buscar?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-14 w-full items-center gap-1 rounded-full border border-border bg-card pl-5 pr-1.5 focus-within:ring-2 focus-within:ring-brand-primary focus-within:ring-offset-2"
    >
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        type="search"
        enterKeyHint="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ej: veterinaria, plomero, comida, gimnasio..."
        aria-label="¿Qué necesitás?"
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-base text-foreground outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        className="flex h-11 shrink-0 items-center rounded-full bg-brand-primary px-5 text-sm font-medium text-brand-primary-foreground transition-colors hover:bg-brand-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
      >
        Buscar
      </button>
    </form>
  );
}

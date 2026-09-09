"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PLACEHOLDER_EXAMPLES = [
  "Ej: se me rompió la bomba de agua",
  "Ej: necesito un electricista",
  "Ej: viandas cerca de Villa Nueva",
  "Ej: cerrajero urgente",
];

export function SearchBar({
  defaultValue = "",
  size = "lg",
}: {
  defaultValue?: string;
  size?: "default" | "lg";
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const placeholder = PLACEHOLDER_EXAMPLES[0];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    router.push(`/buscar?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        size === "lg"
          ? "flex w-full items-center gap-1 rounded-xl border border-border bg-card p-1.5 shadow-sm"
          : "flex w-full items-center gap-1 rounded-lg border border-border bg-card p-1"
      }
    >
      <Search className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="¿Qué necesitás?"
        className={
          size === "lg"
            ? "h-auto border-0 bg-transparent px-2 py-2 text-base focus-visible:ring-0"
            : "h-auto border-0 bg-transparent px-2 py-1.5 text-sm focus-visible:ring-0"
        }
      />
      <Button type="submit" variant="dark" size={size === "lg" ? "default" : "sm"} className="shrink-0">
        Buscar
      </Button>
    </form>
  );
}

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
    <form onSubmit={handleSubmit} className="flex w-full items-end gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label="¿Qué necesitás?"
          className={
            size === "lg"
              ? "h-auto rounded-none border-0 border-b border-border bg-transparent pl-8 pb-3 text-lg focus-visible:ring-0 focus-visible:border-primary"
              : "pl-8"
          }
        />
      </div>
      <Button type="submit" size={size === "lg" ? "lg" : "default"}>
        Buscar
      </Button>
    </form>
  );
}

import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-xl font-medium">Publique</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Guaymallén, Mendoza
          </span>
        </Link>
        <nav className="text-sm font-medium">
          <Link href="/buscar" className="hover:text-primary">
            Buscar
          </Link>
        </nav>
      </div>
    </header>
  );
}

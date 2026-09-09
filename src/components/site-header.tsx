import Link from "next/link";
import { Search } from "lucide-react";

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
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/buscar" className="hidden hover:text-primary sm:inline">
            Categorías
          </Link>
          <Link href="/buscar" className="hidden hover:text-primary sm:inline">
            Zonas
          </Link>
          <Link href="/admin/login" className="hidden hover:text-primary sm:inline">
            Para negocios
          </Link>
          <Link href="/buscar" aria-label="Buscar" className="hover:text-primary">
            <Search className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-bold text-primary">
          Publique
        </Link>
        <nav className="hidden gap-6 text-sm font-medium sm:flex">
          <Link href="/buscar" className="hover:text-primary">
            Buscar
          </Link>
        </nav>
      </div>
    </header>
  );
}

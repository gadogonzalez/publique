export function SiteFooter() {
  return (
    <footer className="border-t border-border py-8 text-sm text-muted-foreground">
      <div className="container flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-serif text-base text-foreground">Publique</p>
        <p>La forma más simple de encontrar quién te resuelve el problema.</p>
        <p>© {new Date().getFullYear()} · Guaymallén, Mendoza</p>
      </div>
    </footer>
  );
}

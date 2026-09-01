export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card py-8 text-sm text-muted-foreground">
      <div className="container flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Publique · Guaymallén, Mendoza</p>
        <p>La forma más simple de encontrar quién te resuelve el problema.</p>
      </div>
    </footer>
  );
}

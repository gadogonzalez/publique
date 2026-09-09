import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";

const linkClass = "block text-muted-foreground hover:text-foreground";
// No corresponding pages exist yet for these -- rendered as inert labels
// rather than dead or misleading links (see redesign report).
const placeholderClass = "block text-muted-foreground/60";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-12 text-sm">
      <div className="container grid grid-cols-2 gap-8 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <p className="font-serif text-lg text-foreground">Publique</p>
          <p className="mt-1 text-muted-foreground">Guaymallén, Mendoza</p>
          <p className="mt-3 max-w-[22ch] text-muted-foreground">
            Conectando personas con negocios reales de tu barrio.
          </p>
          <div className="mt-4 flex items-center gap-3 text-muted-foreground">
            <Instagram className="h-4 w-4" />
            <Facebook className="h-4 w-4" />
          </div>
        </div>

        <div>
          <p className="mb-3 font-medium text-foreground">Explorar</p>
          <div className="space-y-2">
            <Link href="/buscar" className={linkClass}>
              Categorías
            </Link>
            <Link href="/buscar" className={linkClass}>
              Zonas
            </Link>
            <Link href="/buscar" className={linkClass}>
              Todos los negocios
            </Link>
          </div>
        </div>

        <div>
          <p className="mb-3 font-medium text-foreground">Para negocios</p>
          <div className="space-y-2">
            <Link href="/admin/login" className={linkClass}>
              Publicar mi negocio
            </Link>
            <span className={placeholderClass}>Planes y precios</span>
            <span className={placeholderClass}>Preguntas frecuentes</span>
          </div>
        </div>

        <div>
          <p className="mb-3 font-medium text-foreground">Sobre Publique</p>
          <div className="space-y-2">
            <span className={placeholderClass}>Nosotros</span>
            <span className={placeholderClass}>Contacto</span>
          </div>
        </div>
      </div>

      <div className="container mt-10 flex flex-col gap-2 border-t border-border pt-6 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Publique. Todos los derechos reservados.</p>
        <p>Hecho en Mendoza ❤️</p>
      </div>
    </footer>
  );
}

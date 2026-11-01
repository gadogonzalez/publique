import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";
import { PubliqueIsotipo } from "@/components/brand/isotipo";
import { SITE_CONTACT } from "@/lib/site";

const linkClass = "block py-1 text-muted-foreground hover:text-foreground";
const socialClass = "flex h-11 w-11 items-center justify-center rounded-full hover:bg-secondary hover:text-foreground";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-12 text-sm">
      <div className="container grid grid-cols-2 gap-8 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <p className="flex items-center gap-2 font-serif text-lg font-bold text-foreground">
            <PubliqueIsotipo className="h-[22px] w-[22px] shrink-0" />
            Publiqué
          </p>
          <p className="mt-1 text-muted-foreground">Guaymallén, Mendoza</p>
          <p className="mt-3 max-w-[22ch] text-muted-foreground">
            Conectando personas con negocios reales de tu barrio.
          </p>
          {(SITE_CONTACT.instagramUrl || SITE_CONTACT.facebookUrl) && (
            <div className="-ml-3 mt-2 flex items-center text-muted-foreground">
              {SITE_CONTACT.instagramUrl && (
                <a href={SITE_CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Publiqué en Instagram" className={socialClass}>
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {SITE_CONTACT.facebookUrl && (
                <a href={SITE_CONTACT.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Publiqué en Facebook" className={socialClass}>
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>

        <div>
          <p className="mb-3 font-medium text-foreground">Explorar</p>
          <div className="space-y-1">
            <Link href="/categorias" className={linkClass}>
              Categorías
            </Link>
            <Link href="/zonas" className={linkClass}>
              Zonas
            </Link>
            <Link href="/buscar" className={linkClass}>
              Todos los negocios
            </Link>
          </div>
        </div>

        <div>
          <p className="mb-3 font-medium text-foreground">Para negocios</p>
          <div className="space-y-1">
            <Link href="/para-negocios" className={linkClass}>
              Publicar mi negocio
            </Link>
            <Link href="/para-negocios#planes" className={linkClass}>
              Planes y precios
            </Link>
            <Link href="/para-negocios#preguntas" className={linkClass}>
              Preguntas frecuentes
            </Link>
          </div>
        </div>

        <div>
          <p className="mb-3 font-medium text-foreground">Sobre Publiqué</p>
          <div className="space-y-1">
            <Link href="/nosotros" className={linkClass}>
              Nosotros
            </Link>
            <Link href="/nosotros#contacto" className={linkClass}>
              Contacto
            </Link>
          </div>
        </div>
      </div>

      <div className="container mt-10 flex flex-col gap-2 border-t border-border pt-6 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Publiqué. Todos los derechos reservados.</p>
        <p>Hecho en Mendoza ❤️</p>
      </div>
    </footer>
  );
}

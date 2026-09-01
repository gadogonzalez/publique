import Link from "next/link";
import { LayoutDashboard, Building2, Tags, MapPinned } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { LogoutButton } from "@/components/admin/logout-button";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/negocios", label: "Negocios", icon: Building2 },
  { href: "/admin/categorias", label: "Categorías", icon: Tags },
  { href: "/admin/ubicaciones", label: "Ubicaciones", icon: MapPinned },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { email } = await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 border-r border-border bg-card sm:block">
        <div className="p-4">
          <Link href="/admin" className="text-lg font-bold text-primary">
            Publique Admin
          </Link>
        </div>
        <nav className="space-y-1 px-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
          <span className="text-sm text-muted-foreground sm:hidden font-semibold text-foreground">
            Publique Admin
          </span>
          <span className="hidden text-sm text-muted-foreground sm:inline">{email}</span>
          <LogoutButton />
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ContactMessage } from "@/lib/types/database";
import { setMessageStatus } from "./actions";

const REASON_LABEL: Record<ContactMessage["reason"], string> = {
  consulta: "Consulta",
  negocio: "Sumar negocio",
  error: "Dato incorrecto",
};

const dateFmt = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Argentina/Mendoza",
});

export default async function MensajesPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  const messages = (data ?? []) as ContactMessage[];

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">Mensajes</h1>
      <p className="mt-1 text-sm text-muted-foreground">Enviados desde el formulario de /contacto.</p>

      {messages.length === 0 ? (
        <p className="mt-8 text-muted-foreground">Todavía no llegó ningún mensaje.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`rounded-xl border p-4 ${m.status === "new" ? "border-brand-primary bg-card" : "border-border"}`}
            >
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold">{m.name}</span>
                <a href={`mailto:${m.email}`} className="text-brand-primary hover:underline">
                  {m.email}
                </a>
                {m.phone && <span className="text-muted-foreground">{m.phone}</span>}
                <Badge variant="outline">{REASON_LABEL[m.reason]}</Badge>
                {m.status === "new" && <Badge>Nuevo</Badge>}
                <span className="ml-auto text-xs text-muted-foreground">{dateFmt.format(new Date(m.created_at))}</span>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm">{m.message}</p>
              <form action={setMessageStatus.bind(null, m.id, m.status === "new" ? "read" : "new")} className="mt-3">
                <Button type="submit" variant="outline" size="sm">
                  {m.status === "new" ? "Marcar como leído" : "Marcar como nuevo"}
                </Button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

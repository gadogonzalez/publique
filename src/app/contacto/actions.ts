"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { trackServer } from "@/lib/analytics/server";

const schema = z.object({
  name: z.string().trim().min(1, "Ingresá tu nombre").max(120),
  email: z.string().trim().email("Ingresá un email válido").max(200),
  phone: z.string().trim().max(40).optional(),
  reason: z.enum(["consulta", "negocio", "error"]),
  message: z.string().trim().min(10, "Contanos un poco más (mínimo 10 caracteres)").max(2000),
  website: z.string().max(0).optional(), // honeypot: real users leave it empty
});

export interface ContactResult {
  ok: boolean;
  error?: string;
}

export async function sendContactMessage(input: Record<string, string>): Promise<ContactResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    // Honeypot filled -> pretend success so bots don't retry.
    if (parsed.error.issues.some((i) => i.path[0] === "website")) return { ok: true };
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Revisá los datos del formulario" };
  }

  const { name, email, phone, reason, message } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .insert({ name, email, phone: phone || null, reason, message });
  if (error) {
    console.error("[contacto] insert failed", error);
    return { ok: false, error: "No pudimos enviar el mensaje. Probá de nuevo en unos minutos." };
  }

  await trackServer({ type: "contact_form_submit", metadata: { reason } });
  return { ok: true };
}

"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { sendContactMessage } from "./actions";

const REASONS = [
  { value: "consulta", label: "Consulta general" },
  { value: "negocio", label: "Quiero sumar mi negocio" },
  { value: "error", label: "Encontré un dato incorrecto" },
];

export function ContactForm({ defaultReason = "consulta" }: { defaultReason?: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(
      Array.from(new FormData(e.currentTarget), ([k, v]) => [k, String(v)])
    );
    setError(null);
    startTransition(async () => {
      const result = await sendContactMessage(data);
      if (result.ok) setSent(true);
      else setError(result.error ?? "No pudimos enviar el mensaje.");
    });
  }

  if (sent) {
    return (
      <div role="status" className="rounded-2xl bg-brand-primary-soft p-6 sm:p-8">
        <CheckCircle2 className="h-6 w-6 text-brand-primary" />
        <h2 className="mt-3 font-serif text-lg font-bold tracking-tight">Mensaje enviado</h2>
        <p className="mt-1 text-sm text-muted-foreground">Gracias por escribirnos. Te respondemos por email.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" name="name" required maxLength={120} autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required maxLength={200} autoComplete="email" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">
            Teléfono <span className="font-normal text-muted-foreground">(opcional)</span>
          </Label>
          <Input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reason">Motivo</Label>
          <Select id="reason" name="reason" defaultValue={defaultReason}>
            {REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Mensaje</Label>
        <Textarea id="message" name="message" required minLength={10} maxLength={2000} rows={5} />
      </div>
      {/* Honeypot: hidden from people, bots tend to fill it. */}
      <div aria-hidden className="hidden">
        <label>
          No completar
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" variant="brand" size="lg" disabled={pending}>
        {pending ? "Enviando…" : "Enviar mensaje"}
      </Button>
    </form>
  );
}

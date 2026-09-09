"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

/**
 * Requests a Supabase recovery email. Used both from the login page's
 * "forgot password" link and from /reset-password when a recovery link
 * turns out to be expired or invalid.
 */
export function RequestResetForm({ initialEmail = "" }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setStatus(error ? "error" : "sent");
  }

  if (status === "sent") {
    return (
      <p className="text-sm text-muted-foreground">
        Si el email existe, te enviamos un enlace para restablecer tu contraseña.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label htmlFor="reset-email">Email</Label>
        <Input
          id="reset-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-destructive">
          No pudimos enviar el enlace. Intenta de nuevo.
        </p>
      )}
      <Button type="submit" disabled={status === "sending"} variant="outline" className="w-full">
        {status === "sending" ? "Enviando..." : "Enviar enlace de recuperación"}
      </Button>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RequestResetForm } from "@/components/admin/request-reset-form";
import { createClient } from "@/lib/supabase/client";

const MIN_PASSWORD_LENGTH = 8;

type Status = "checking" | "ready" | "invalid" | "success";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");
  const [invalidReason, setInvalidReason] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Supabase redirects recovery links here with the session in the URL
    // hash (#access_token=...&type=recovery) or, if the link expired, with
    // #error=...&error_description=... instead.
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const hashErrorDescription = hashParams.get("error_description");

    if (hashErrorDescription) {
      const reason = decodeURIComponent(hashErrorDescription.replace(/\+/g, " "));
      queueMicrotask(() => {
        setInvalidReason(reason);
        setStatus("invalid");
      });
      return;
    }

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setStatus("ready");
      }
    });

    // No recovery token in the URL at all (e.g. someone navigated here
    // directly) -- only treat as valid if a session already exists.
    if (!hashParams.has("access_token")) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          setInvalidReason("Este enlace de recuperación no es válido o ya expiró.");
          setStatus("invalid");
        }
      });
    }

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setFormError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Las contraseñas no coinciden.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setSubmitting(false);
      setFormError("No pudimos actualizar la contraseña. Intenta de nuevo.");
      return;
    }

    // The recovery link left the user signed in -- sign out so they log
    // back in explicitly with the new password.
    await supabase.auth.signOut();
    setStatus("success");
    setTimeout(() => router.push("/admin/login?reset=success"), 1500);
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="mb-4 text-lg font-bold">Restablecer contraseña</h1>

        {status === "checking" && (
          <p className="text-sm text-muted-foreground">Verificando enlace...</p>
        )}

        {status === "invalid" && (
          <div className="space-y-4">
            <p className="text-sm text-destructive">{invalidReason}</p>
            <p className="text-sm text-muted-foreground">
              Solicita un nuevo enlace de recuperación:
            </p>
            <RequestResetForm />
          </div>
        )}

        {status === "ready" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Nueva contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={MIN_PASSWORD_LENGTH}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                minLength={MIN_PASSWORD_LENGTH}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Guardando..." : "Guardar nueva contraseña"}
            </Button>
          </form>
        )}

        {status === "success" && (
          <p className="text-sm text-primary">
            Contraseña actualizada. Redirigiendo al inicio de sesión...
          </p>
        )}
      </div>
    </div>
  );
}

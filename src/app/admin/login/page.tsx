"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RequestResetForm } from "@/components/admin/request-reset-form";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "not_admin"
      ? "Tu cuenta no tiene acceso al panel de administración."
      : null
  );
  const resetSuccess = searchParams.get("reset") === "success";
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signInError) {
      setError("Email o contraseña incorrectos.");
      return;
    }
    router.push(searchParams.get("redirectTo") || "/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="mb-1 text-lg font-bold">Publique Admin</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Acceso solo para equipo de Publique.
        </p>
        {resetSuccess && (
          <p className="mb-4 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
            Contraseña actualizada. Ingresa con tu nueva contraseña.
          </p>
        )}
        {showReset ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ingresa tu email para recibir un enlace de recuperación.
            </p>
            <RequestResetForm initialEmail={email} />
            <button
              type="button"
              onClick={() => setShowReset(false)}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Volver a ingresar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
            <button
              type="button"
              onClick={() => setShowReset(true)}
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

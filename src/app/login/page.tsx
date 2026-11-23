"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { MdFilledButton, MdTextField } from "@/components/material/ui";
import { authClient } from "@/lib/auth-client";

function destinoAposLogin(next: string | null): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/app/resumo";
}

function LoginForm() {
  const params = useSearchParams();
  const next = destinoAposLogin(params.get("next"));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    const { error: err } = await authClient.signIn.email({ email, password });
    if (err) {
      setLoading(false);
      setError(err.message || "E-mail ou senha inválidos.");
      return;
    }
    window.location.assign(next);
  }

  return (
    <AuthShell title="Entrar" subtitle="Use o e-mail e a senha da sua conta.">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <MdTextField
          name="email"
          type="email"
          label="E-mail"
          required
          autoComplete="email"
          defaultValue={process.env.NODE_ENV !== "production" ? "demo@local.test" : undefined}
        />
        <MdTextField
          name="password"
          type="password"
          label="Senha"
          required
          autoComplete="current-password"
          defaultValue={process.env.NODE_ENV !== "production" ? "demo1234" : undefined}
        />

        {error ? (
          <p className="auth-alert auth-alert-error" role="alert">
            {error}
          </p>
        ) : null}

        <MdFilledButton type="submit" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </MdFilledButton>
      </form>

      <div className="auth-footer">
        <Link href="/esqueci-senha" className="auth-link">
          Esqueci a senha
        </Link>
        <p>
          Não tem conta?{" "}
          <Link href="/cadastro" className="auth-link">
            Criar conta
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <AuthShell title="Entrar">
          <p className="auth-subtitle">Carregando…</p>
        </AuthShell>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

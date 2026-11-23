"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { MdFilledButton, MdTextField } from "@/components/material/ui";
import { authClient } from "@/lib/auth-client";

export default function CadastroPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "");
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    const { error: err } = await authClient.signUp.email({ name, email, password });
    if (err) {
      setLoading(false);
      setError(err.message || "Não foi possível criar a conta.");
      return;
    }
    window.location.assign("/app/resumo");
  }

  return (
    <AuthShell title="Criar conta" subtitle="Leva menos de um minuto para começar.">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <MdTextField name="name" label="Nome" required autoComplete="name" />
        <MdTextField name="email" type="email" label="E-mail" required autoComplete="email" />
        <MdTextField name="password" type="password" label="Senha" required autoComplete="new-password" />

        {error ? (
          <p className="auth-alert auth-alert-error" role="alert">
            {error}
          </p>
        ) : null}

        <MdFilledButton type="submit" disabled={loading}>
          {loading ? "Criando…" : "Criar conta"}
        </MdFilledButton>
      </form>

      <div className="auth-footer">
        <p>
          Já tem conta?{" "}
          <Link href="/login" className="auth-link">
            Entrar
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

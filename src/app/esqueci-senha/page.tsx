"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { MdFilledButton, MdTextField } from "@/components/material/ui";
import { authClient } from "@/lib/auth-client";

export default function EsqueciSenhaPage() {
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMsg(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const { error: err } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/login",
    });
    setLoading(false);
    if (err) {
      setError(err.message || "Falha ao solicitar reset.");
      return;
    }
    setMsg(
      process.env.NODE_ENV === "production"
        ? "O envio do link por e-mail ainda não está disponível."
        : "Se o e-mail existir, o link de reset aparece no terminal do servidor (teste local).",
    );
  }

  return (
    <AuthShell title="Esqueci a senha" subtitle="Informe o e-mail da conta para receber o link.">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <MdTextField name="email" type="email" label="E-mail" required />
        {error ? (
          <p className="auth-alert auth-alert-error" role="alert">
            {error}
          </p>
        ) : null}
        {msg ? <p className="auth-alert auth-alert-ok">{msg}</p> : null}
        <MdFilledButton type="submit" disabled={loading}>
          {loading ? "Enviando…" : "Enviar link"}
        </MdFilledButton>
      </form>
      <div className="auth-footer">
        <Link href="/login" className="auth-link">
          Voltar ao login
        </Link>
      </div>
    </AuthShell>
  );
}

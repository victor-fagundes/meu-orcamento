"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { excluirContaAction } from "@/app/actions/conta";
import { authClient } from "@/lib/auth-client";
import { MdFilledButton, MdOutlinedButton, MdTextButton, MdTextField } from "@/components/material/ui";

export function ExcluirContaPanel({ email }: { email: string }) {
  const router = useRouter();
  const [phrase, setPhrase] = useState("");
  const [arm, setArm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <section className="aj-block el-danger" style={{ marginTop: 16 }}>
      <h2 className="aj-h2">Excluir conta</h2>
      <p className="aj-help">
        Remove permanentemente a conta <strong>{email}</strong>, o orçamento, lançamentos, cartões e
        limites. Esta ação não pode ser desfeita neste ambiente de teste.
      </p>

      {!arm ? (
        <MdOutlinedButton onClick={() => setArm(true)}>Quero excluir minha conta…</MdOutlinedButton>
      ) : (
        <>
          <MdTextField
            label="Digite EXCLUIR para confirmar"
            value={phrase}
            onChange={setPhrase}
            autoComplete="off"
          />
          {error ? <p className="sheet-error" role="alert">{error}</p> : null}
          <div className="aj-actions">
            <MdTextButton
              disabled={pending}
              onClick={() => {
                setArm(false);
                setPhrase("");
                setError(null);
              }}
            >
              Cancelar
            </MdTextButton>
            <MdFilledButton
              disabled={pending || phrase.trim().toUpperCase() !== "EXCLUIR"}
              onClick={() => {
                start(async () => {
                  const res = await excluirContaAction(phrase);
                  if (!res.ok) {
                    setError(res.error);
                    return;
                  }
                  await authClient.signOut();
                  router.push("/");
                  router.refresh();
                });
              }}
            >
              {pending ? "Excluindo…" : "Excluir definitivamente"}
            </MdFilledButton>
          </div>
        </>
      )}
    </section>
  );
}

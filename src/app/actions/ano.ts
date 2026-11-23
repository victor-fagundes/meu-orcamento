"use server";

import { anoCivil, dataCivil, lerAno } from "@/application/ano";
import type { GradeAno } from "@/domain/ano-grade";
import { runDb } from "@/db";
import { requireSessionOrcamento } from "@/lib/session";

export async function carregarAnoAction(
  ano: string,
): Promise<{ ok: true; grade: GradeAno } | { ok: false }> {
  if (!/^\d{4}$/.test(ano)) return { ok: false };
  try {
    const { orcamento } = await requireSessionOrcamento();
    const grade = await runDb((db) => lerAno(db, orcamento.id, anoCivil(ano), dataCivil()));
    return { ok: true, grade };
  } catch (erro) {
    if (redirecionamento(erro)) throw erro;
    return { ok: false };
  }
}

function redirecionamento(erro: unknown): boolean {
  return (
    typeof erro === "object" &&
    erro !== null &&
    "digest" in erro &&
    String((erro as { digest: unknown }).digest).startsWith("NEXT_REDIRECT")
  );
}

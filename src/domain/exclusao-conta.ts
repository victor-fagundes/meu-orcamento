export type FraseExclusao = { ok: true } | { ok: false; motivo: "vazia" | "diferente" };

/** Só EXCLUIR, depois do trim das pontas. Maiúsculas contam. */
export function confirmarFraseExclusao(frase: string): FraseExclusao {
  const texto = frase.trim();
  if (!texto) return { ok: false, motivo: "vazia" };
  if (texto === "EXCLUIR") return { ok: true };
  return { ok: false, motivo: "diferente" };
}

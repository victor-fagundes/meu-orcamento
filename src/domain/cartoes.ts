export type CreateCartaoInput = {
  apelido: string;
  diaFechamento?: number | null;
  diaVencimento?: number | null;
  instituicao?: string;
  ultimos4?: string;
};

export type CreateCartaoParsed =
  | {
      ok: true;
      apelido: string;
      diaFechamento: number | null;
      diaVencimento: number | null;
      instituicao: string | null;
      ultimos4: string | null;
    }
  | { ok: false; error: string };

function optionalDay(
  n: number | null | undefined,
  label: string,
  max: number,
): { ok: true; v: number | null } | { ok: false; error: string } {
  if (n == null || Number.isNaN(n as number)) return { ok: true, v: null };
  const d = Math.trunc(n);
  if (d < 1 || d > max) return { ok: false, error: `${label} deve ser entre 1 e ${max}.` };
  return { ok: true, v: d };
}

export function validateCreateCartao(input: CreateCartaoInput): CreateCartaoParsed {
  const apelido = input.apelido.trim().replace(/\s+/g, " ");
  if (!apelido) return { ok: false, error: "Informe o apelido do cartão." };
  if (apelido.length > 60) return { ok: false, error: "Apelido muito longo." };

  const fech = optionalDay(input.diaFechamento ?? null, "Dia de fechamento", 28);
  if (!fech.ok) return fech;
  const venc = optionalDay(input.diaVencimento ?? null, "Dia de vencimento", 31);
  if (!venc.ok) return venc;

  let ultimos4: string | null = null;
  if (input.ultimos4 != null && String(input.ultimos4).trim() !== "") {
    const u = String(input.ultimos4).replace(/\D/g, "");
    if (u.length !== 4) return { ok: false, error: "Últimos 4 dígitos: informe exatamente 4 números." };
    ultimos4 = u;
  }

  const instituicao = input.instituicao?.trim() ? input.instituicao.trim().slice(0, 80) : null;

  return {
    ok: true,
    apelido,
    diaFechamento: fech.v,
    diaVencimento: venc.v,
    instituicao,
    ultimos4,
  };
}

export function isCartaoAtivo(ativo: number | boolean): boolean {
  return ativo !== 0 && ativo !== false;
}

export function cartaoSemFechamento(diaFechamento: number | null | undefined): boolean {
  return diaFechamento == null;
}

const AVISO_SEM_FECHAMENTO = "Sem dia de fechamento, a competência é o mês da compra.";

export function textoLinhaCartao(cartao: {
  diaFechamento: number | null;
  diaVencimento: number | null;
}): string {
  if (cartao.diaFechamento == null) {
    if (cartao.diaVencimento == null) return AVISO_SEM_FECHAMENTO;
    return `${AVISO_SEM_FECHAMENTO} · vence dia ${cartao.diaVencimento}`;
  }
  if (cartao.diaVencimento == null) return `Fecha dia ${cartao.diaFechamento}`;
  return `Fecha dia ${cartao.diaFechamento} · vence dia ${cartao.diaVencimento}`;
}

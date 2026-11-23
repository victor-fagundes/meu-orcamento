import { labelCompetencia, shiftCompetencia } from "@/lib/competencia-nav";

export const AREAS = [
  { id: "resumo", rotulo: "Resumo", endereco: "/app/resumo", icone: "dashboard", pedeMes: true },
  { id: "orcamento", rotulo: "Orçamento", endereco: "/app/orcamento", icone: "assignment", pedeMes: false },
  { id: "lancamentos", rotulo: "Lançamentos", endereco: "/app/lancamentos", icone: "list", pedeMes: false },
  { id: "ano", rotulo: "Ano", endereco: "/app/ano", icone: "calendar_month", pedeMes: false },
  { id: "ajustes", rotulo: "Ajustes", endereco: "/app/ajustes", icone: "settings", pedeMes: false },
] as const;

export type AreaId = (typeof AREAS)[number]["id"];

export type NavegacaoMes = {
  rotulo: string;
  anterior: string;
  proximo: string;
};

export function abaAtiva(pathname: string): AreaId | "" {
  const path = pathname.split("?")[0] ?? "";
  if (path.startsWith("/app/ajustes")) return "ajustes";
  const area = AREAS.find(
    (item) => path === item.endereco || path.startsWith(`${item.endereco}/`),
  );
  return area?.id ?? "";
}

/** Mês no cabeçalho só quando a área pede. Só o Resumo pede. */
export function navegacaoMesDaArea(
  area: { pedeMes: boolean },
  mes: string,
): NavegacaoMes | null {
  if (!area.pedeMes) return null;
  return {
    rotulo: labelCompetencia(mes),
    anterior: shiftCompetencia(mes, -1),
    proximo: shiftCompetencia(mes, 1),
  };
}

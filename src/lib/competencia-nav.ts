/** YYYY-MM helpers for month navigation */

export function parseCompetencia(comp: string): { y: number; m: number } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(comp);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  if (mo < 1 || mo > 12) return null;
  return { y, m: mo };
}

export function shiftCompetencia(comp: string, deltaMonths: number): string {
  const p = parseCompetencia(comp);
  if (!p) return comp;
  const total = p.m - 1 + deltaMonths;
  const y = p.y + Math.floor(total / 12);
  const m = ((total % 12) + 12) % 12;
  return `${y}-${String(m + 1).padStart(2, "0")}`;
}

export function labelCompetencia(comp: string): string {
  const p = parseCompetencia(comp);
  if (!p) return comp;
  const d = new Date(p.y, p.m - 1, 1);
  const s = d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function planoDoMes(planoJson: string, competencia: string): number {
  const p = parseCompetencia(competencia);
  if (!p) return 0;
  try {
    const arr = JSON.parse(planoJson) as unknown;
    if (!Array.isArray(arr) || arr.length !== 12) return 0;
    const v = arr[p.m - 1];
    return typeof v === "number" ? Math.trunc(v) : 0;
  } catch {
    return 0;
  }
}

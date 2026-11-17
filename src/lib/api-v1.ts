import { NextResponse } from "next/server";

export type ApiErrorBody = { error: string };

export function jsonOk<T>(body: T, init?: { status?: number }) {
  return NextResponse.json(body, { status: init?.status ?? 200 });
}

export function jsonError(status: number, error: string) {
  return NextResponse.json({ error } satisfies ApiErrorBody, { status });
}

/** Convert integer centavos from the Android client into a BRL decimal string for application/domain toCents. */
export function centavosToBrlString(centavos: number): string {
  if (!Number.isInteger(centavos) || centavos < 0) {
    throw new Error("valorCentavos deve ser inteiro não negativo");
  }
  return (centavos / 100).toFixed(2);
}

export function parseCompetenciaParam(raw: string | null): string | null {
  if (!raw) return null;
  return /^\d{4}-\d{2}$/.test(raw) ? raw : null;
}

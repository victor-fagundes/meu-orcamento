/**
 * Telemetria mínima (MO-1101) — sem PII.
 * MVP: console estruturado; trocar por sink real depois.
 */

export type TelemetryEvent =
  | "lancamento_criado"
  | "lancamento_editado"
  | "lancamento_excluido"
  | "navegacao_mes"
  | "sessao_duracao"
  | "alerta_acionado"
  | "import_planilha_iniciada"
  | "import_planilha_confirmada"
  | "import_planilha_abandonada"
  | "import_pdf_iniciada"
  | "import_pdf_confirmada"
  | "import_pdf_abandonada"
  | "export_iniciado";

export function track(
  event: TelemetryEvent,
  props?: Record<string, string | number | boolean | null | undefined>,
): void {
  const safe: Record<string, string | number | boolean> = {};
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v == null) continue;
      // bloquear chaves que parecem PII
      if (/email|nome|name|desc|descricao|cpf|phone/i.test(k)) continue;
      safe[k] = v;
    }
  }
  if (process.env.NODE_ENV !== "test") {
    console.info("[telemetry]", event, safe);
  }
}

# Quickstart: Validate Import Controle Financeiro Polish

## Prerequisites

- App running locally; demo user (`demo@local.test` / seed password)
- Cartão with fechamento 1–28 for card-path SC-001 competência check
- Fixture: `fixtures/controle-financeiro-reference.xlsx` (or documented alias of
  `fixtures/Controle_Financeiro_Victor_Atualizado.xlsx` after sanitize)
- Spec status `ready` or `implemented` for smoke
- Baseline: PRD 5.7 / D-04 (cartão) — 020 Option B

## Automated (domain)

```bash
npx vitest run src/domain/import-planilha.fixture.test.ts src/domain/import-planilha.test.ts src/domain/competencia.test.ts
```

**Expect**:

- Best sheet for card path ≠ Relatórios when card sheet exists
- Best sheet for plan prefer ≠ Relatórios when Gastos Mensais-like sheet exists
- Sample ≥20 accepted rows: `dataTransacao` year matches nearest section/bill year (SC-001)
- With fechamento, `competenciaCartao(dt, diaFechamento)` equals persisted/preview competência
  (section month does **not** override)
- `buildPlanoPreview` on planning sheet → `cellsUpdated` / ok rows &gt; 0 (SC-002)
- Relatórios-only plan path → zero usable plan cells + clear why

## Manual UI (≤10 min, SC-003)

1. Ajustes → Import planilha → upload reference workbook.
2. Select **card** sheet → preview shows dates + competência (may differ from section month
   if fechamento shifts) → confirm.
3. Open Lançamentos for a reported competência — dates/year look right; competência matches
   cartão rule.
4. Same or new upload → select **planning** sheet → confirm separately (FR-012).
5. Open Orçamento — non-empty months from sheet updated; blank months unchanged.
6. Optional: force Relatórios as plan sheet → preview explains failure / zero plan.

## Post-smoke

- Mark GAP-001 / GAP-002 closed in `docs/PRODUCT_GAP_BACKLOG.md` (SC-005).
- Check ACs on `specs/020-import-controle-polish/spec.md`; amend notes on **current** 014/015.

## Out of scope checks

- Do not require full Release B verify (export/PDF/telemetry).
- Do not require GAP-003 UX redesign.
- Do not expect competência == Excel section month (Option A rejected).

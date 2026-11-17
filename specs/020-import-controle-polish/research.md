# Research: Import Controle Financeiro Polish

## Decision: Competência follows cartão fechamento (PRD 5.7 / D-04) — Option B

**Rationale**: After 2026-11-16 baseline realignment, PRD/DECISOES/specs require the
same competência rule for import and manual lançamentos. Forcing Excel section month
as competência (prior Option A) would reintroduce product contradiction.

**Approach**:
1. Section/bill headers improve **`dataTransacao`** parsing (year/day context; avoid
   “today” year alone) — still the GAP-001 date fix.
2. On preview and commit, compute competência via existing `competenciaMeio` /
   `competenciaCartao(dataTransacao, diaFechamento)`.
3. Preview MUST display that post-rule competência (may differ from section month).

**Alternatives considered**:
- Section overrides competência on commit — rejected (PM Option B; fights baseline).
- User picks section vs cartão per import — deferred (Option C not chosen).

## Decision: Section context still required for date year

**Rationale**: Smoke failures included wrong calendar year on abbreviated dates
(`28/nov` under `SET / 2026`). Option B does not remove section parsing; it only
stops section from writing `lancamentos.competencia` directly.

**Alternatives considered**:
- Ignore section entirely — rejected (would leave GAP-001 date year bugs).

## Decision: Keep merge-only plan writes (`plano[m] > 0`)

**Rationale**: `importVfPlano` already merges non-zero months and leaves others.
Matches clarify Option B. Align with rewritten 015: negative/illegible → 0 in preview
cell; zeros do not clear prior stored months on merge.

**Alternatives considered**:
- Wipe year then write — rejected in clarify.

## Decision: Sheet scoring prefers planning names; Relatórios stays penalized

**Rationale**: Unchanged. `prefer: "lanc" | "plano"` + UI sheet picker for FR-012.

## Decision: Sanitized fixture path

**Rationale**: Unchanged (FR-013). Prefer `fixtures/controle-financeiro-reference.xlsx`
or documented alias of existing CF fixture.

## Decision: Amend current 014/015 text (post-rewrite)

**Rationale**: 014/015 were rewritten in the realignment session. Amend notes must
target the **new** domain-rules tables (date parsing + cartão competência; sheet
prefer + merge), not the old short AC list.

## Decision: No `competenciaFatura` persist field

**Rationale**: Under Option B, optional preview hint of “section month” is allowed for
UX, but commit path stays `competenciaMeio`. Prefer computing preview competência the
same way as commit (needs card fechamento available at preview time when meio=cartao).

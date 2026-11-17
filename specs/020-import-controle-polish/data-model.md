# Data Model: Import Controle Financeiro Polish

Logical shapes for polish (extends existing import preview; no new DB tables).

## Source Section Context

| Field | Type | Rules |
|-------|------|-------|
| year | number | From fatura header e.g. `MARÇO / 2026` — aids **date** parsing |
| monthIndex | number | 0–11 from month label — bill context for abbr dates |
| competenciaHint | string \| null | Optional `YYYY-MM` of section for UI only; **not** persisted as competência |

**Lifecycle**: Updated when a row parses as section header; applied to subsequent
lancamento **date** parsing until replaced.

## Import Preview Row (lancamento)

Extends existing preview row:

| Field | Type | Rules |
|-------|------|-------|
| dt | string \| null | ISO `dataTransacao`; year from section when present; day from row |
| competencia | string \| null | Preview of post-rule competência (`competenciaMeio` / cartão) |
| valCents | number | Integer ≥ 0; accept only &gt; 0 |
| ok / why | boolean / string | Preview rejection reasons |
| duplicate | boolean | D-05 duplicate rule |

**Commit rule**: Always compute `lancamentos.competencia` via `competenciaMeio(dt, meio,
diaFechamento)` — same as manual lançamentos (FR-014). Do **not** persist section month
as competência.

## Plan Month Amount (planejamento)

| Field | Type | Rules |
|-------|------|-------|
| tipo / grupo / nome | string | Item identity |
| plano[12] | number[] | Integer centavos per month |
| cellsUpdated | number | Count of non-empty source months |

**Merge rule**: For each month `m`, if source `plano[m] > 0` then overwrite stored
month; if source empty/zero, leave stored value unchanged (FR-005). Preview may map
negative/illegible → 0 per 015.

## Sheet Candidate

| Field | Type | Rules |
|-------|------|-------|
| name | string | Workbook sheet name |
| layout | `lanc` \| `vf` \| `plano` \| unknown | From detectLayout |
| score | number | pickBestSheet; Relatórios penalized |

**Relationship**: One upload → many candidates; user confirms **one path at a time**
(FR-012).

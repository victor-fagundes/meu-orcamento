# Research: Project Specification Review

## Decision: Documentation-only deliverable (no app code)

**Rationale**: Spec FR-006 forbids product code in this feature. The value is a
shared backlog and inventory, not a new UI.

**Alternatives considered**:
- Interactive admin “spec dashboard” — rejected (scope creep, violates simplicity).
- Linear/Jira import only — rejected (PM wants in-repo truth for agents).

## Decision: Two output files in `docs/`

**Rationale**: Separation of concerns — inventory (state of specs) vs gap backlog
(actionable work). Both git-tracked for session continuity (SC-005).

**Alternatives considered**:
- Single combined doc — workable but harder to diff/update next slice alone.
- Only update each `spec.md` status in place — insufficient for cross-cutting gaps
  and “next slice” designation.

## Decision: Fit labels `aligned` | `drift` | `gap`

**Rationale**: Three states match independent-test language in the feature spec and
are enough for PM triage without a complex maturity model.

**Alternatives considered**:
- Five-level maturity (draft→verified continuum) — already exists as Status; fit is
  orthogonal (status can be `implemented` while fit is `drift`).

## Decision: Known smoke gaps seeded from PM session (import)

**Rationale**: Conversation and telemetry already established: card import landed in
non-current competência; date year inference; planning sheet (“Planilhas de Gastos
Mensais”) vs card-only path; month navigation on Lançamentos. Review must surface
these explicitly (SC-002).

**Alternatives considered**:
- Fresh blank-sheet review ignoring smoke — rejected (would lose signal).

## Decision: Next-slice candidate default (subject to PM confirm)

**Rationale**: Highest user impact remaining is trustworthy import of the Controle
Financeiro workbook (dates + planejamento). Designate tentatively as
“Import Controle Financeiro polish”; agent drafts it, PM must set
`pm_confirmation: confirmed` before 019 closes (clarify session).

**Alternatives considered**:
- Persist PGlite / Neon first — important but does not unblock import correctness.
- PDF golden-file accuracy — P1 later; PM focused on XLSX first.
- Close 019 on draft alone — rejected (FR-005 hard gate).

## Decision: No automated contract tests

**Rationale**: Deliverables are human-reviewed Markdown; validation is the
quickstart checklist. Constitution does not require Vitest for docs-only work.

**Alternatives considered**:
- Schema JSON + CI lint — optional later; YAGNI for v1 review.

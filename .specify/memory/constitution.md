<!--
Sync Impact Report
- Version change: (template placeholders) → 1.0.0
- Modified principles: [PRINCIPLE_1..5] → filled with Meu Orçamento governance
- Added sections: Domain & Money Constraints; Spec-Driven Workflow
- Removed sections: none (scaffold headings replaced with concrete names)
- Follow-up TODOs: none
- Note: scratch report — remove before committing this file if desired
-->

# Meu Orçamento Constitution

## Core Principles

### I. Domain Purity
Domain rules (competência, parcelas, alertas, saldos, parsers de import) MUST live in
`src/domain` as pure TypeScript: no imports of Next.js, React, Drizzle, or I/O.
Application and UI layers MUST call domain functions; they MUST NOT reimplement the same
rules. Rationale: one rule, one place — UI and import share identical calculations.

### II. Integer Money (NON-NEGOTIABLE)
All monetary amounts in domain, persistence, export, and import MUST be integer cents.
Float/double arithmetic in domain or DB monetary columns is forbidden. Conversion between
BRL display and cents MUST occur only at boundaries (forms, parsers, formatters).
Rationale: PRD §6; prevents rounding drift across Resumo, Orçamento, Ano, and imports.

### III. Spec-Driven Delivery (NON-NEGOTIABLE)
No feature code without a versioned spec under `specs/*/spec.md`. Implementation MUST
start only when status is `ready` (or `implemented` for corrections). Acceptance criteria
and `tasks.md` checkboxes MUST be updated when work completes; a story is not done until
ACs are checkable and status advances toward `verified`.
Rationale: SDD is the contract between product (PRD/MO-xxx) and code.

### IV. Vertical Slice
Each MO-xxx story MUST deliver domain/DB + use-case/API + usable UI in the same delivery,
aligned to the UX prototype. Closing “API only” or “placeholder screen” and deferring UI
is forbidden, except for pure infra stories (secrets, migrate) that still need UI smoke
when a user flow exists.
Rationale: PM tests end-to-end; half-slices hide integration debt.

### V. Simplicity & Isolation
Prefer the smallest change that satisfies the AC. Cross-tenant data MUST always be scoped
by `orcamentoId` from the session. Workspace artifacts MUST stay in the repo (not loose
`Downloads`/home). Do not expand scope beyond the active spec.
Rationale: solo PM-dev velocity and safe multi-tenant defaults.

## Domain & Money Constraints

- Stack baseline: Next.js App Router, TypeScript, Drizzle + PostgreSQL/PGlite, Better Auth,
  Vitest for domain, Playwright for critical E2E when required by the story.
- Sources of truth: PRD (`docs/PRD_*`), Architecture (`docs/ARCHITECTURE_*`), SDD
  (`docs/SDD_*`), decisions (`docs/DECISOES_*`), UX (`prototype/*.html`), agent rules
  (`AGENTS.md`).
- Import parsers (planilha/PDF) MUST run server-side in memory; MUST NOT persist uploaded
  files after import unless an explicit product opt-in exists.
- Telemetry MUST exclude PII (no email, names, or raw description content in event props).

## Spec-Driven Workflow

1. Choose MO-xxx → author/update `specs/NNN-slug/spec.md` + `tasks.md`.
2. Status `ready` → implement vertical slice against ACs.
3. Mark tasks/ACs → status `implemented` → PM smoke → `verified`.
4. Release gates in `AGENTS.md` / SDD override ad-hoc ordering (e.g. Release B after A
   verified, unless PM explicitly continues).
5. Failed verify: fix code or amend the spec — never silently weaken ACs in code only.

## Governance

This constitution supersedes informal practice when they conflict. Amendments MUST:
document the change in this file, bump `CONSTITUTION_VERSION` (MAJOR for incompatible
principle removal/redefinition; MINOR for new/expanded principles; PATCH for
clarifications), set **Last Amended** to the amendment date, and keep **Ratified** as the
original adoption date.

Agents and humans MUST treat `AGENTS.md` as runtime operating guidance consistent with
this constitution. PRs and agent sessions MUST verify: domain purity, integer money, active
spec readiness, and vertical-slice DoD before claiming a story done. Unjustified complexity
MUST be rejected or deferred to a new spec.

**Version**: 1.0.0 | **Ratified**: 2026-11-16 | **Last Amended**: 2026-11-16

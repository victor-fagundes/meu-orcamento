# Feature Specification: Project Specification Review

**Feature Branch**: `019-project-spec-review`

**Created**: 2026-11-16

**Status**: `verified`

**Input**: User description: "revisar a especificação do projeto"

## Clarifications

### Session 2026-11-16

- Q: Onde registrar o resultado de cada spec — só docs centrais ou também cada `specs/*/spec.md`? → A: Só docs centrais (`SPEC_INVENTORY` + `PRODUCT_GAP_BACKLOG`); `amend_spec` fica no backlog para features seguintes.
- Q: A 019 só fecha após PM confirmar a next slice, ou basta proposta do revisor? → A: PM deve confirmar a next slice para fechar a 019.
- Q: Quão profunda a revisão da Release A vs B/import? → A: Inventário completo; gaps profundos só em Release B / import.
- Q: Quem redige inventário e backlog — agente ou só PM? → A: Agente redige; PM revisa e confirma.
- Q: Release A `implemented` sem smoke falho → fit default `aligned`? → A: Sim; `drift`/`gap` só com evidência.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Inventory of product specs (Priority: P1)

As the product owner, I review every existing feature specification and the product
source documents so I know what is claimed as done versus what still needs verification
or correction.

**Why this priority**: Without a clear inventory, polish and bug fixes compete without
shared priority, and “implemented” stories may not match what the product actually does.

**Independent Test**: Produce a complete inventory table of all feature specs with
status, release, and a one-line fit assessment (aligned / drift / missing).

**Acceptance Scenarios**:

- [x] 1. **Given** the set of feature specs in the project and the PRD/decision docs, **When**
   the review inventory is completed, **Then** every feature spec appears once with
   current status and a fit label (aligned, drift, or gap).
- [x] 2. **Given** stories marked implemented or verified, **When** the inventory is reviewed,
   **Then** any story known to fail PM smoke (for example import dates or planning sheet)
   is marked as drift or gap, not as fully verified.
- [x] 3. **Given** Release A specs without known smoke failures, **When** fit is assigned under
   the agreed review depth, **Then** deep PRD re-audit is not required for those rows and
   fit defaults to `aligned` unless evidence supports `drift` or `gap`.

---

### User Story 2 - Capture open product gaps (Priority: P1)

As the product owner, I consolidate open gaps from recent smoke testing and from
mismatches between PRD and specs into a prioritized backlog of follow-up features.

**Why this priority**: Recent testing showed import and planning issues; the backlog must
reflect those findings before more code is written.

**Independent Test**: A prioritized gap list exists with severity, user impact, and
suggested next feature title for each item; PM can order the next `/speckit-specify`
from that list.

**Acceptance Scenarios**:

- [x] 1. **Given** known smoke findings (import transaction dates vs source sheet; planning
   sheet for fixed/variable income and expenses; month navigation and post-import
   orientation), **When** the gap list is published, **Then** each finding has priority
   (P1/P2/P3), expected user outcome, and whether it needs a new feature spec or a
   correction to an existing one.
- [x] 2. **Given** the constitution and SDD rules, **When** gaps are listed, **Then** no gap
   proposes skipping specs or delivering UI-only / API-only slices.

---

### User Story 3 - Agree next delivery slice (Priority: P2)

As the product owner, I leave the review with a single agreed next feature to specify
and implement, so work resumes without re-debating scope.

**Why this priority**: Review without a next step does not restore delivery cadence.

**Independent Test**: One next feature is named with in/out-of-scope in
`docs/PRODUCT_GAP_BACKLOG.md`, and the PM has explicitly confirmed that choice.

**Acceptance Scenarios**:

- [x] 1. **Given** the prioritized gap list, **When** a next slice is proposed, **Then** it
   includes in-scope and out-of-scope bullets and references the gaps it closes.
- [x] 2. **Given** a proposed next slice, **When** the PM has not yet confirmed it, **Then**
   this feature MUST NOT be marked complete.
- [x] 3. **Given** PM confirmation of the next slice, **When** the review closes, **Then**
   remaining P2/P3 gaps stay on the backlog without blocking the confirmed slice.

---

### Edge Cases

- What happens when a spec is marked `implemented` but ACs are unchecked?
  → Treat as drift until ACs are reconciled or demoted.
- What happens when PRD and a feature spec disagree?
  → Prefer PRD for product intent; record the conflict in the gap list; do not silently
  change PRD in this review unless PM decides so.
- What happens when code already fixed a gap but the spec still says open?
  → Mark as aligned after a short smoke note; update the feature spec status in a
  follow-up amendment, not ad-hoc code claims.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The review MUST produce an inventory of all feature specifications under
  the project specs area, including identifier, title, status, and fit assessment.
- **FR-002**: The review MUST include the product sources of truth (product requirements,
  architecture decisions already assumed, and constitution) when judging fit.
- **FR-003**: The review MUST record open gaps discovered in PM smoke of import and
  related screens, with priority and user-visible impact; deep gap analysis MUST
  focus on Release B / import, while Release A receives inventory coverage without
  equal-depth PRD re-audit unless a known smoke failure applies.
- **FR-004**: The review MUST distinguish “amend existing feature spec” vs “create new
  feature spec” for each gap.
- **FR-005**: The review MUST designate exactly one next delivery slice with clear
  in-scope and out-of-scope statements, and the PM MUST explicitly confirm that slice
  before this feature is considered complete.
- **FR-006**: The review MUST NOT itself implement product code changes; code work
  starts only after a dedicated feature reaches ready status.
- **FR-007**: Outcomes of the review MUST be written as durable project documentation
  reachable by the PM and by future agents (not only chat history): specifically
  `docs/SPEC_INVENTORY.md` and `docs/PRODUCT_GAP_BACKLOG.md`.
- **FR-008**: This feature MUST NOT edit individual `specs/*/spec.md` files to change
  status or acceptance checkboxes; gaps that need such edits MUST be listed with
  `action_type = amend_spec` for a later feature.
- **FR-009**: An agent MAY draft the inventory and backlog; the PM MUST review those
  drafts and MUST confirm the next slice before completion.
- **FR-010**: Release A specs that are `implemented` (or `verified`) with no known smoke
  failure in this review MUST be labeled `aligned` by default; `drift` or `gap` requires
  a short evidence note in the inventory.

### Key Entities

- **Feature Spec Record**: Identifier, title, status, release, fit (aligned/drift/gap),
  notes.
- **Product Gap**: Description, severity/priority, user impact, related MO/PRD refs if
  known, follow-up action type.
- **Next Slice**: Name, in-scope, out-of-scope, dependency on prior verified work.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of existing feature specs appear in the inventory with a fit label.
- **SC-002**: At least the known import/planning smoke issues appear as explicit gaps
  with priority (none left only in chat memory).
- **SC-003**: After reading the backlog, the PM confirms (or corrects) the next slice
  in under 2 minutes; without that confirmation the review is not complete.
- **SC-004**: Zero gaps in the review propose skipping Spec-Driven Delivery or vertical
  slices.
- **SC-005**: Review documentation is available in the repo so a new session can continue
  without re-deriving the backlog from conversation.

## Assumptions

- The PM (Victor) is the sole decision-maker for fit labels and next slice; an agent may
  draft documents for that review.
- “Project specification” means PRD + decisions + constitution + feature specs (001–018 and
  successors), not a rewrite of the entire PRD in this feature.
- Release A remains the baseline; Release B import/export work is the main area of
  expected drift after recent smoke and the focus of deep gap write-ups.
- Release A specs are inventoried for status/fit, but are not re-audited line-by-line
  against the full PRD in this feature unless smoke evidence indicates drift.
- Code fixes for import dates, planning sheet import, and related UX continue only as
  separate features after this review designates them.
- Existing `implemented` marks are provisional until smoke/`verified` unless the
  inventory explicitly confirms alignment.
- Fit assessments live only in the central inventory during this feature; per-folder
  spec files remain unchanged until a dedicated amend/verify feature runs.
- Explicit PM confirmation of the next slice is a hard gate for completing this feature.
- Lack of formal `verified` alone does not force Release A rows to `drift`.

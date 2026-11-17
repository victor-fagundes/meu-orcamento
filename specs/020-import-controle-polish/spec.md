# Feature Specification: Import Controle Financeiro Polish

**Feature Branch**: `020-import-controle-polish`

**Created**: 2026-11-16

**Status**: `verified`

**Input**: User description: "Import Controle Financeiro polish (dates + planejamento)" — next slice confirmed in `docs/PRODUCT_GAP_BACKLOG.md` (GAP-001, GAP-002); empty `/speckit-specify` resolved from that backlog.

**Related**: Amends behavior covered by `014-import-planilha` and `015-import-planejamento` (`action_type = amend_spec`). Closes GAP-001 and GAP-002. Baseline after 2026-11-16 doc realignment: PRD 5.7 / D-04 (cartão fechamento) and rewritten 014/015/021.

## Clarifications

### Session 2026-11-16

- Q: When a planejamento import updates Orçamento, should non-empty months from the sheet replace existing plan amounts for those items, leave empty source months untouched, or wipe the whole year plan first? → A: Merge: write only non-empty source months; keep existing amounts elsewhere (Option B).
- Q: In one upload of a Controle Financeiro workbook that has both card lançamentos and a planning sheet, must the user confirm both in a single import, or may they run card and planejamento as separate confirms? → A: Separate confirms allowed; user may import each path independently in the same or later session (Option B).
- Q: For card rows under a fatura/section header, which month should define the lançamento’s competência? → A: *(superseded 2026-11-16 evening)* Originally Option A (section = competência). **Revised:** Option B — cartão fechamento rule wins.
- Q: For SC-001/SC-002, must a sanitized Controle Financeiro sample workbook live in the repo as the reference fixture, or is PM smoke against a local file enough? → A: Sanitized reference workbook committed in-repo for repeatable checks (Option A).
- Q: Should this feature also edit the acceptance text in the older import specs (014 and 015), or keep all new acceptance only in 020? → A: Amend 014/015 briefly; 020 is the active implement/verify spec (Option A).

### Session 2026-11-16 (rethink after baseline realignment)

- Q: After PRD/specs realignment, should import competência follow the Excel section/fatura header or the cartão fechamento rule (PRD 5.7 / D-04)? → A: **B** — Cartão fechamento wins. Section headers only help infer transaction **year/day** (and bill context for parsing); persisted competência MUST use `competenciaMeio` / `competenciaCartao` like manual lançamentos. Preview MUST show the competência that commit will write under that rule.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Trustworthy dates then cartão competência (Priority: P1)

As the product owner importing my Controle Financeiro workbook, I need purchase
**dates** inferred from section context (not “today’s year” alone), and the
**competência** of each card row to follow the same cartão fechamento rule as a
manual lançamento (PRD 5.7 / D-04), so Resumo/Orçamento/Ano stay consistent.

**Why this priority**: Wrong calendar year on `dataTransacao` still breaks trust
(GAP-001); overriding competência with the Excel section would fight the realigned
baseline.

**Independent Test**: Import a known Controle Financeiro sample under a section with
an explicit year; accepted rows get plausible ISO dates (section helps year/day);
after confirm with an active card + fechamento, `competencia` matches
`competenciaCartao(dataTransacao, diaFechamento)` — not “section month forces
competência”.

**Acceptance Scenarios**:

- [x] 1. **Given** a workbook section labeled with a month/year that differs from “today”,
   **When** the user imports card/lancamento rows from that section, **Then**
   `dataTransacao` uses that context for year (and day from the row) instead of
   inventing “today’s year” alone.
- [x] 2. **Given** an accepted card row with resolved `dataTransacao` and a cartão with
   fechamento 1–28, **When** import confirms, **Then** `competencia` equals the
   cartão rule (compra no dia do fechamento → fatura do mês seguinte), same as
   manual entry.
- [x] 3. **Given** a preview before confirm, **When** the user reviews dates and
   competências or changes the destination cartão, **Then** the preview refreshes
   and its competência matches what commit will persist under the cartão (or
   débito/pix) rule for the cartão selected at confirm time.
- [x] 4. **Given** an abbreviated date such as `05/jan` and no section/bill year above
   that row, **When** preview is built, **Then** the row is not accepted and the
   preview states that the year was not taken from the workbook.
- [x] 5. **Given** a lançamento confirm with uploaded rows, a column map, and a selected
   meio, **When** the client also sends a preview payload, **Then** the server rebuilds
   the preview from the rows, map, and meio and does not persist meio, amount,
   accept/reject, or duplicate from that payload.

---

### User Story 2 - Import planejamento from Gastos Mensais (Priority: P1)

As the product owner, I import the planning sheet (fixed/variable income and expenses
for the year) so Orçamento reflects my Controle Financeiro plan — not an empty or
wrong sheet such as Relatórios.

**Why this priority**: GAP-002 blocks planning migration; equal priority to dates for
workbook fidelity.

**Independent Test**: Import a workbook that contains both Relatórios-like sheets and a
Gastos Mensais (or equivalent) planning layout; after confirm, planned monthly amounts
appear in Orçamento for the mapped items, with a non-zero successful plan row count when
the source has values.

**Acceptance Scenarios**:

- [x] 1. **Given** a multi-sheet workbook where Relatórios is not the planning sheet, **When**
   the system detects layout for planejamento, **Then** it selects the planning sheet
   (e.g. Gastos Mensais / fixas / variáveis), not Relatórios.
- [x] 2. **Given** a valid planning sheet with monthly amounts, **When** the user confirms
   import, **Then** positive source months overwrite the matching item/month in
   Orçamento; an explicit negative or illegible cell writes 0 for that month on an
   existing item (015); a blank cell or a literal zero leaves the stored amount
   unchanged.
- [x] 3. **Given** a sheet that looks like a report with no usable plan cells, **When** it is
   considered for planejamento, **Then** the user sees a clear rejection or zero-plan
   explanation in preview — not a silent “success” with an empty plan.

---

### User Story 3 - Preview and confirm remain end-to-end usable (Priority: P2)

As the product owner, I complete upload → detect → preview → confirm in Ajustes and
can open the month where imported data landed, so the polish is a full usable flow
(not parser-only).

**Why this priority**: Constitution requires vertical slice; dates/plan fixes must ship
with a usable UI path.

**Independent Test**: Without leaving the product UI, run card/lancamento confirm with
corrected dates and (separately if needed) planejamento confirm, then navigate to a
competence / Orçamento view that shows the new data.

**Acceptance Scenarios**:

- [x] 1. **Given** a successful preview with corrected dates and/or plan rows, **When** the
   user confirms, **Then** the confirmation report lists accepted vs rejected/duplicate
   counts (D-05) and does not require a developer tool to verify.
- [x] 2. **Given** imported lançamentos in a competence other than the UI’s current month,
   **When** import finishes, **Then** the user can reach that competence from the product
   (link or month navigation) without guessing the URL.

---

### Edge Cases

- What happens when a sheet has mixed section headers with incomplete year labels?
  → Prefer the nearest explicit year/month header above the rows for **date parsing**;
  if none exists, do not accept an abbreviated date and state that the year was not
  taken from the workbook (do not invent “today” silently). Competência still follows
  meio/cartão after a date is known.
- What happens when section month and cartão competência disagree?
  → Expected under Option B: date may sit in section context; competência follows
  fechamento (may be next month). Preview must show the post-rule competência.
- What happens when both a card sheet and a planning sheet exist in one workbook?
  → Detect both layouts; user may confirm card/lancamentos and planejamento as
  separate confirms (same upload session or later). Neither path may steal the
  other’s sheet. A single confirm that does both is not required.
- What happens when planejamento creates missing catalog items?
  → Keep existing MO-804 behavior (optional create); amounts still in integer cents at
  the money boundary.
- What happens when the planning sheet has some months blank for an item?
  → Merge only non-empty months; blank source months do not erase existing plan values.
- What happens when Relatórios is the only sheet?
  → Preview explains that no planning layout was found; do not write empty plan as success.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Import MUST use Controle Financeiro section/bill labeling to improve
  `dataTransacao` inference (year and day context) when present.
- **FR-002**: Import MUST NOT invent transaction year solely from the device’s “today”
  when the workbook provides a conflicting section/bill year for date parsing.
- **FR-015**: Lançamento confirm MUST rebuild the preview on the server from the
  uploaded rows, the column map, and the selected meio/cartão. It MUST NOT persist
  `meio`, amount, accept/reject, or duplicate taken from a client-supplied preview.
- **FR-016**: An abbreviated date with no explicit year and no preceding section/bill
  year MUST NOT be accepted. Preview MUST state that the year was not taken from the
  workbook.
- **FR-014**: Persisted `competencia` for imported card rows MUST follow PRD 5.7 / D-04
  (`competenciaCartao` / `competenciaMeio`) using the resolved `dataTransacao` and the
  cartão’s `diaFechamento` (1–28); MUST NOT force competência to equal the Excel
  section month.
- **FR-003**: Preview MUST show the `dataTransacao` and `competencia` that will be
  persisted on confirm (including cartão shift when applicable).
- **FR-004**: Planejamento detection MUST prefer sheets that contain monthly plan
  structure (e.g. Gastos Mensais / fixas / variáveis) over Relatórios-like sheets.
- **FR-005**: Confirming a valid planejamento import MUST merge into the user’s
  visible monthly plan (Orçamento): write only non-empty source months for matched
  items; MUST NOT clear months that are empty in the sheet; MUST NOT wipe the whole
  year plan first. An explicit negative or illegible month cell MUST be 0 in preview
  and MUST write 0 for that month when merging into an existing item (015). A blank
  cell or a literal zero MUST leave the stored amount unchanged.
- **FR-006**: When no usable planning layout is found, the product MUST communicate
  that clearly in preview/report (no false empty success).
- **FR-007**: The feature MUST deliver a usable vertical slice: detection + preview +
  confirm + way to open the affected competence/plan in the UI.
- **FR-012**: When a workbook exposes both card/lancamento and planejamento layouts,
  the product MUST allow the user to confirm each path independently (separate
  confirms); it MUST NOT require a single confirm that applies both.
- **FR-008**: Monetary values MUST remain whole centavos end-to-end (no fractional
  currency in stored plan or lançamentos).
- **FR-009**: This feature MUST briefly amend the **current** `specs/014-import-planilha/spec.md`
  and `specs/015-import-planejamento/spec.md` (post-realignment text) with an Amend (020)
  note + AC deltas; 020 remains the active implement/verify spec.
- **FR-010**: Formal Release B verify for export/PDF/telemetry (GAP-004) is OUT OF SCOPE.
- **FR-011**: Post-import orientation polish beyond reaching the competence (GAP-003
  residual) is OUT OF SCOPE unless already satisfied by existing navigation; do not
  block this feature on a full UX redesign.
- **FR-013**: The project MUST include a sanitized Controle Financeiro reference workbook
  in-repo used to validate SC-001 and SC-002 (PM may still smoke with a personal file).

### Key Entities

- **Source Section Context**: Month/year labeling that aids **date** parsing for grouped
  card rows; does **not** override cartão competência.
- **Import Preview Row**: Proposed lançamento with `dataTransacao`, preview `competencia`
  (after meio/cartão rule), amount (centavos), accept/reject/duplicate (D-05).
- **Plan Month Amount**: Item + month + amount intended for Orçamento after confirm.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Using the sanitized in-repo Controle Financeiro reference workbook, ≥ 95% of
  accepted card/lancamento rows have `dataTransacao` year consistent with the nearest
  section/bill year context (spot-check ≥ 20 rows); and for rows with meio cartão +
  fechamento, persisted `competencia` matches `competenciaCartao(dt, diaFechamento)`.
- **SC-002**: Importing that same in-repo reference workbook’s planning sheet yields a
  non-zero plan update in Orçamento whenever the source sheet has non-empty monthly
  amounts; Relatórios alone never counts as a successful plan import.
- **SC-003**: PM can complete one polished import (dates + plan) and verify results in
  the product UI in under 10 minutes without reading chat history.
- **SC-004**: Zero accepted rows store money as non-integer centavos.
- **SC-005**: After this feature, GAP-001 and GAP-002 are marked closed (or equivalent)
  in `docs/PRODUCT_GAP_BACKLOG.md` following PM smoke.

## Assumptions

- Feature description taken from PM-confirmed next slice in
  `docs/PRODUCT_GAP_BACKLOG.md` (2026-11-16) because `/speckit-specify` had empty
  arguments.
- Baseline docs/specs were realigned in another session (2026-11-16); 020 was revised
  the same evening to Option B for competência.
- A sanitized Controle Financeiro reference workbook is committed in-repo for SC-001/002;
  PM may still use a full personal file for extra smoke.
- Existing upload size/format limits and duplicate rules from rewritten 014 / D-05 remain.
- Creating missing items on plan import remains optional as in 015.
- Planejamento import is merge-only for non-empty months (clarification session).
- Card/lancamento and planejamento confirms may be independent (clarification session).
- Card competência follows PRD 5.7 / D-04 after date resolve (rethink Option B).
- GAP-003 residual UX is parking-lot; month navigation / post-import link already partly
  shipped and is enough if competence is reachable.
- GAP-004 Release B formal verify is a later feature.
- PM smoke on 2026-11-16 closed SC-003 and SC-005. Status is `verified`. GAP-003 stays out of scope.
- Work continues as correction/`amend_spec` on import behavior with status `ready` before
  code changes; domain money rules stay integer centavos.
- 014/015 receive short amend notes on their **current** text during this feature.

# Data Model: Project Specification Review

Logical entities for the review deliverables (documentation records, not DB tables).

## Feature Spec Record

| Field | Type | Rules |
|-------|------|-------|
| id | string | Spec folder prefix, e.g. `014` |
| slug | string | Folder name, e.g. `014-import-planilha` |
| title | string | From spec heading |
| status | enum | `draft` \| `ready` \| `implemented` \| `verified` (as in file) |
| release | string | A / B / infra / process if stated |
| fit | enum | `aligned` \| `drift` \| `gap` |
| notes | string | One-line justification for fit |

**Relationships**: Many records → one inventory document.

**Transitions (fit)**:
- Start from status + smoke evidence.
- Release A + `implemented`/`verified` + no smoke failure → `aligned` (FR-010).
- `implemented` + failing smoke → `drift`.
- Missing coverage for a PRD capability → related gap entity (may not add a new
  Feature Spec Record until a new folder exists).
- This feature never mutates source `specs/*/spec.md` (FR-008).

## Product Gap

| Field | Type | Rules |
|-------|------|-------|
| id | string | Stable id, e.g. `GAP-001` |
| title | string | Short user-facing name |
| priority | enum | `P1` \| `P2` \| `P3` |
| user_impact | string | What the PM/user sees wrong or missing |
| evidence | string | Smoke note / PRD ref / spec id |
| action_type | enum | `amend_spec` \| `new_spec` \| `verify_only` |
| related_specs | string[] | Optional list of slug ids |

## Next Slice

| Field | Type | Rules |
|-------|------|-------|
| name | string | Feature title for next `/speckit-specify` or amend |
| in_scope | string[] | Bullets |
| out_of_scope | string[] | Bullets |
| depends_on | string | e.g. “inventory draft ready” |
| gap_ids | string[] | Gaps closed by this slice |
| pm_confirmation | enum | `pending` \| `confirmed` (+ date/note when confirmed) |

**Constraint**: Exactly one Next Slice per completed review (FR-005).  
**Completion gate**: Review incomplete while `pm_confirmation` is `pending` (FR-005).

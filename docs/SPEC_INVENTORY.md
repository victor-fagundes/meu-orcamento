# Spec Inventory — Meu Orçamento

**Date**: 2026-11-16  
**Drafter**: agent  
**Reviewer**: PM (Victor)  
**Feature**: `019-project-spec-review`

## Sources consulted

- `docs/PRD_Meu_Orcamento_v1_0.txt`
- `docs/ARCHITECTURE_Meu_Orcamento.md`
- `docs/SDD_Meu_Orcamento.md`
- `docs/DECISOES_ASSUMIDAS_v1_0.md`
- `.specify/memory/constitution.md`
- `AGENTS.md`
- **22** feature specs under `specs/*/spec.md` (001–022)

## Review depth note

Release A is inventoried with default fit rules (FR-010): `implemented` / `verified` without known smoke failure → `aligned`. Deep analysis targets Release B / import smoke (clarifications 2026-11-16). This document does **not** edit individual `specs/*/spec.md` files (FR-008).

## Inventory table

| id | slug | title | status | release | fit | notes |
|----|------|-------|--------|---------|-----|-------|
| 001 | 001-foundation | Foundation (MO-101–103) | verified | A | aligned | PM verify 2026-11-16. Produção Neon continua fora deste status |
| 002 | 002-catalog | Catálogo inicial (MO-201) | verified | A | aligned | PM verify 2026-11-16 |
| 003 | 003-itens | CRUD de itens (MO-202) | verified | A | aligned | PM verify 2026-11-16 |
| 004 | 004-plano | Planejamento mensal (MO-203) | verified | A | aligned | PM verify 2026-11-16; import of plan is Release B (015) |
| 005 | 005-cartoes | Cadastro de cartões (MO-301) | verified | A | aligned | PM verify 2026-11-16 |
| 006 | 006-competencia | Competência por fatura (MO-302) | verified | A | aligned | PM verify 2026-11-16 |
| 007 | 007-lancamentos | Criar lançamento (MO-303) | verified | A | aligned | PM verify 2026-11-16 |
| 008 | 008-lista-lancamentos | Listar e buscar lançamentos (MO-304) | verified | A | aligned | PM verify 2026-11-16 |
| 009 | 009-editar-lancamentos | Editar lançamento por escopo (MO-305) | verified | A | aligned | PM verify 2026-11-16 |
| 010 | 010-excluir-lancamentos | Excluir com desfazer (MO-306) | verified | A | aligned | PM verify 2026-11-16 |
| 011 | 011-orcamento-mensal | Visão Orçamento mensal (MO-401) | verified | A | aligned | PM verify 2026-11-16 |
| 012 | 012-resumo | Resumo cards + gráficos (MO-601, MO-602) | verified | A | aligned | PM verify 2026-11-16. GAP-006 (legenda/links) segue em aberto |
| 013 | 013-release-a-close | Fechamento Release A (MO-1002, MO-1102) | verified | A | aligned | PM verify 2026-11-16 |
| 014 | 014-import-planilha | Importação de planilha (MO-801–803) | verified | B | aligned | PM verify 2026-11-16. GAP-003 segue em aberto |
| 015 | 015-import-planejamento | Importar planejamento mensal (MO-804) | verified | B | aligned | PM verify 2026-11-16 |
| 016 | 016-import-pdf | Importação de fatura PDF (MO-901–903) | verified | B | aligned | PM verify 2026-11-16 |
| 017 | 017-export | Exportar CSV e JSON (MO-1001) | verified | B | aligned | PM verify 2026-11-16 |
| 018 | 018-telemetry | Telemetria mínima (MO-1101) | verified | B | aligned | PM verify 2026-11-16 |
| 019 | 019-project-spec-review | Project Specification Review | verified | process | aligned | PM verify 2026-11-16 |
| 020 | 020-import-controle-polish | Import Controle Financeiro polish | verified | B | aligned | PM smoke 2026-11-16; GAP-001 e GAP-002 fechados |
| 021 | 021-ano | Visão Ano (MO-501) | verified | A | aligned | PM verify 2026-11-16 |
| 022 | 022-item-unico | Um item só no Orçamento | verified | B | aligned | PM verify 2026-11-16; GAP-005 fechado |

## Summary counts

### By fit

| fit | count |
|-----|-------|
| aligned | 22 |
| drift | 0 |
| gap | 0 |
| **Total** | **22** |

### By status

| status | count |
|--------|-------|
| implemented | 0 |
| draft | 0 |
| verified | 22 |

### By release

| release | count |
|---------|-------|
| A | 14 |
| B | 7 |
| process | 1 |

## Self-reference

All 22 specs (001–022) are `verified` after the PM marked verify on 2026-11-16. Em 2026-11-17 a spec 025 (`implemented`) fecha o card Total gasto e o destino do import de lançamentos. GAP-007 continua aberto. O PM ainda não marcou a 025 como `verified`.

# Product Gap Backlog — Meu Orçamento

**Date**: 2026-11-16  
**Inventory**: [SPEC_INVENTORY.md](./SPEC_INVENTORY.md)  
**Status**: specs 001–022 `verified` — próxima fatia ainda não confirmada  
**Feature**: `022-item-unico`

## Depth policy

Deep write-ups focus on **Release B / import** smoke. Release A gaps appear only when smoke evidence exists (not a full PRD re-audit). On 2026-11-16 the PM marked every current spec `verified`.

## Gaps table

| id | title | priority | user_impact | action_type | related_specs | evidence |
|----|-------|----------|-------------|-------------|---------------|----------|
| GAP-001 | Import dates vs Controle Financeiro source | P1 | **Fechado** — 020 `verified`. Seção define o ano da data; competência segue o cartão. | amend_spec | 014-import-planilha, 020 | PM smoke 2026-11-16 |
| GAP-002 | Import planejamento (Gastos Mensais / fixas / variáveis) | P1 | **Fechado** — 020 `verified`. Aba de planejamento + merge (positivo substitui; negativo/ilegível zera; vazio ou zero não apaga). | amend_spec | 015-import-planejamento, 020 | PM smoke 2026-11-16 |
| GAP-003 | Post-import orientation / competência visibility | P2 | **Fechado para lançamentos** — spec 025 `implemented`. Abre o mês civil se ele foi gravado; senão a competência mais recente. Planejamento continua no Orçamento do mês corrente (non-goal da 025). | amend_spec | 014-import-planilha, 025-chegar-no-mes | Código 2026-11-17 |
| GAP-004 | Release B verify (`implemented` sem `verified`) | P2 | **Fechado** — PM marcou 001–022 como `verified` em 2026-11-16, inclusive import, PDF, export e telemetria. | verify_only | 014, 015, 016, 017, 018, 021 | PM verify 2026-11-16 |
| GAP-005 | Um item só: plano da seção não vira grupo com o nome da aba | P1 | **Fechado** — 022 `verified`. Plano da seção fica no item do catálogo. | amend_spec | 015-import-planejamento, 011-orcamento-mensal, 007-lancamentos, 022-item-unico | PM verify 2026-11-16 |
| GAP-006 | Resumo legível (eixo, legenda, Ver detalhes) | P2 | **Fechado** — legenda e “Ver detalhes” já estavam no código (023). O card Total gasto omitia `mes`; spec 025 `implemented` corrige. | amend_spec | 012-resumo, 025-chegar-no-mes | Código 2026-11-17 |
| GAP-007 | Sheet no teclado e nome de Arquivar | P2 | **Decidido, ainda aberto** — spec 037 `draft`. No computador o foco entra no campo certo sem selecionar o texto; o primeiro Arquivar continua curto e anuncia o item; a confirmação diz "Arquivar {nome}?"; Resumo, Orçamento, Lançamentos e Ano ganham região principal. Escape e a permanência do Tab dentro do diálogo já existem. | amend_spec | 007-lancamentos, 003-itens, 011-orcamento-mensal, 037-foco-arquivar | Crítica UI 2026-11-16; decisão 2026-11-17 |

## Next slice

**Closed**: Import Controle Financeiro polish — `specs/020-import-controle-polish` `verified` after PM smoke (2026-11-16). GAP-001 and GAP-002 closed.

**Closed**: GAP-004 e GAP-005. Todas as specs 001–022 estão `verified` (PM, 2026-11-16).

**Decidido na spec 037 `draft`, ainda não construído**:
- GAP-007 — foco ao abrir o diálogo, confirmação "Arquivar {nome}?" e região principal no computador

**Closed 2026-11-17**: GAP-003 (lançamentos; planejamento permanece non-goal) e GAP-006, via spec 025. Status da 025 é `implemented` até o PM marcar `verified`.

## Parking lot

| id | title | priority | note |
|----|-------|----------|------|
| GAP-007 | Sheet no teclado | P2 | Saiu do estacionamento. A decisão está na spec 037 `draft`. |

## Compliance note

No gap in this backlog proposes skipping Spec-Driven Delivery or delivering API-only / UI-only slices. Follow-up work MUST remain vertical (constitution IV) and start from `ready` (or `implemented` for corrections) specs (constitution III). Feature 019 itself does not change product code under `src/**` (FR-006).

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

## Atualização 2026-11-23

Status lido em `specs/*/spec.md`. A tabela de 001–022 acima não muda.

| id | slug | status | nota |
|----|------|--------|------|
| 023 | 023-material-design | implemented | Casca Material anterior. A casca viva é a 042 |
| 024 | 024-producao-nuvem | implemented | HTTPS de produção responde. Conta nova e sobrevivência a deploy não foram conferidas em 23 nov |
| 025 | 025-chegar-no-mes | implemented | Destino da importação testado. O Resumo novo não tem o card Total gasto |
| 026 | 026-reset-por-email | draft | Fora de implementação |
| 027 | 027-android-native | implemented | Roteiro no aparelho em aberto |
| 028 | 028-android-mes | implemented | Roteiro no aparelho em aberto |
| 029 | 029-computador-revisao | implemented | O Resumo e o Orçamento novos não repetem os textos desta revisão |
| 030 | 030-android-casca | implemented | Roteiro no aparelho em aberto |
| 031 | 031-android-resumo | implemented | Roteiro no aparelho em aberto |
| 032 | 032-android-orcamento | implemented | Roteiro no aparelho em aberto |
| 033 | 033-android-lancamentos | implemented | Roteiro no aparelho em aberto |
| 034 | 034-android-ano | implemented | Roteiro no aparelho em aberto |
| 035 | 035-android-ajustes | implemented | Roteiro no aparelho em aberto |
| 036 | 036-android-traz-dados | implemented | Roteiro no aparelho em aberto |
| 037 | 037-foco-arquivar | implemented | Arquivar com o nome passou no Orçamento novo. O foco ao abrir o plano não |
| 038 | 038-material-android | implemented | Roteiro no aparelho em aberto |
| 039 | 039-acabamento-android | implemented | T021 pede para não marcar `verified` antes do aparelho |
| 040 | 040-ds-integrado-next | implemented | Critérios da spec marcados. Suíte do DS e build não foram reexecutados em 23 nov |
| — | 040-replicar-front-prototipo | Cancelled | Não é a spec 040 do rebuild |
| 041 | 041-categorias | verified | PM, 23 nov 2026 |
| 042 | 042-shell-web | verified | Playwright `e2e/casca.spec.ts`, 23 nov 2026 |
| 043 | 043-resumo-web | verified | Playwright `e2e/resumo.spec.ts`, 23 nov 2026 |
| 044 | 044-orcamento-web | verified | Playwright `e2e/orcamento.spec.ts`, 23 nov 2026 |
| 045 | 045-lancamentos-web | verified | Playwright `e2e/lancamentos.spec.ts`, 23 nov 2026 |
| 046 | 046-ano-web | verified | Playwright `e2e/ano.spec.ts`, 23 nov 2026 |
| 047 | 047-ajustes-web | verified | Playwright `e2e/ajustes.spec.ts`, 23 nov 2026 |
| 048 | 048-entrada-web | verified | PM testou, 23 nov 2026. Playwright `e2e/entrada.spec.ts` |
| 049 | 049-remocao-front-antigo | ready | 048 está `verified`. Esta história pode começar |

Contagem desta atualização: `verified` 8 (041–048), `implemented` 17, `ready` 1, `draft` 1, `Cancelled` 1.

# Spec: 006 — Competência por fatura (MO-302)

**Status:** `verified`  
**Release:** A  
**Sprint:** 2  
**Histórias:** MO-302  
**PRD:** 5.7, D-01, D-04

## Context

A competência do cartão é o mês em que a fatura fecha. Débito, PIX e dinheiro usam o mês da data. O vencimento do cartão não entra no cálculo.

## Goals

1. Com dia de fechamento de 1 a 28, compra antes desse dia fica no mês da compra; no dia ou depois, no mês seguinte (D-04).
2. Sem dia de fechamento, a competência é o mês da compra.
3. Parcelas avançam um mês de competência a partir da primeira.
4. O simulador em Ajustes mostra essa prévia.

## Non-goals

- Override manual de competência por lançamento.
- Recalcular competência antiga quando o fechamento do cartão muda.
- Tratar emissores com regra diferente da D-04. O aviso dessa diferença fica no cadastro do cartão.

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Antes do fechamento | Fechamento 25, compra 10/05/2026 | `2026-05` |
| No dia | Fechamento 25, compra 25/05/2026 | `2026-06` |
| Depois | Fechamento 25, compra 26/05/2026 | `2026-06` |
| Parcelas | 26/05/2026, fechamento 25, 3 parcelas | `2026-06`, `2026-07`, `2026-08` |
| Sem fechamento | Qualquer data | Mês da data |
| Dia inválido | Fechamento 0, 29 ou ausente numérico inválido | Cálculo de cartão não devolve competência |
| Outros meios | Débito, PIX ou dinheiro em 26/05/2026 | `2026-05` |
| Virada de ano | Fechamento 25, compra 26/12/2026 | `2027-01` |

## Acceptance criteria

- [x] AC-302.1 Fechamento 25: 10/05 → maio; 25/05 → junho; 26/05 → junho.
- [x] AC-302.2 26/05 em 3× → junho, julho e agosto.
- [x] AC-302.3 Sem fechamento → mês da compra.
- [x] AC-302.4 Débito, PIX e dinheiro usam o mês da data, mesmo depois do dia 25.
- [x] AC-302.5 Fechamento fora de 1–28 não produz competência de cartão.
- [x] AC-302.6 O simulador em Ajustes mostra o mês resultante para uma data e um fechamento informados.

## Test plan

Unit: `src/domain/competencia.ts` com a tabela desta spec.

## Open questions

Nenhuma. D-04.

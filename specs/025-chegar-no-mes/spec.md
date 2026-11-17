# Spec: 025 — Chegar no mês certo (MO-601, MO-803)

**Status:** `implemented`  
**Release:** A + B  
**Sprint:** —  
**Histórias:** MO-601, MO-803  
**PRD:** 5.2, 5.12, D-09

## Context

O Resumo da competência C já calcula o total gasto desse mês. O card Total gasto abria Lançamentos sem `mes`, e a lista caía no mês civil. A spec 012 (AC-601.2) já exigia a mesma competência. O código não cumpria.

Na confirmação de lançamentos importados, a lista de competências volta ordenada e a tela usava a primeira. Num arquivo com janeiro e junho, a pessoa abria janeiro. A spec 014 não dizia para onde ir depois do relatório.

## Goals

1. O card Total gasto abre Lançamentos na competência que o Resumo está mostrando.
2. Depois de importar lançamentos, abrir a competência do mês civil se alguma linha gravada caiu nela.
3. Se o mês civil não está entre as linhas gravadas, abrir a competência mais recente do conjunto. Nunca a mais antiga só porque a lista vem ordenada.
4. O relatório nomeia o mês aberto. Se houver outras competências gravadas, diz quantas.

## Non-goals

- Levar o filtro de pagamento ou de categoria do Resumo para Lançamentos.
- Mudar os links que já mandam `mes` (orçado, saldo, “Ver detalhes”).
- Escolher mês na importação de planejamento. Ela continua abrindo o Orçamento no mês corrente.
- PDF, teclado do sheet, nome acessível de Arquivar, `<main>`.
- Reordenar ou regravar competência. A regra de fatura (spec 006) não muda.

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Mês civil presente | Competências `2026-01`, `2026-11`, `2026-06`; mês civil `2026-11` | Abre `2026-11` |
| Mês civil ausente | `2026-01`, `2026-06`; mês civil `2026-11` | Abre `2026-06` |
| Uma só | `2024-03`; mês civil `2026-11` | Abre `2024-03` |
| Vazia | Nenhuma competência gravada | Não escolhe mês e não navega |
| Inválida | `2026-13` misturada com `2026-04` | Ignora a inválida e abre `2026-04` |
| Ordem | `2026-08` antes de `2026-02` na lista; mês civil `2026-01` | Abre `2026-08` |
| Card | Resumo em `2026-04` | Href `/app/lancamentos?mes=2026-04` |
| Relatório | Destino `2026-06` e 3 competências | Nomeia `2026-06` e mais 2 |

## Acceptance criteria

- [x] AC-025.1 Sem o mês civil no conjunto, o destino é a competência mais recente, não a primeira da lista ordenada.
- [x] AC-025.2 Com o mês civil no conjunto, o destino é esse mês.
- [x] AC-025.3 Conjunto vazio não tem destino.
- [x] AC-025.4 O card Total gasto do Resumo aponta para Lançamentos com o `mes` da tela.
- [x] AC-025.5 Com mais de uma competência gravada, o relatório nomeia o mês aberto e a quantidade das outras.

## Test plan

Unit: `src/domain/navegacao-mes.test.ts` cobre a tabela.  
UI: o card usa o href da mesma função; a confirmação de lançamentos chama o destino com o mês civil do clique.  
E2E: não nesta história.

## Open questions

Nenhuma. O mês de chegada é o mês civil quando ele recebeu linha; senão o mais recente. Planejamento fica de fora.

## Design técnico

Omitido. Não há schema, use-case novo com efeito colateral nem integração externa. A escolha do mês é função pura; a tela só navega.

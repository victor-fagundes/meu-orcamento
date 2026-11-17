# Spec: 021 — Visão Ano (MO-501)

**Status:** `verified`  
**Release:** A  
**Sprint:** 5  
**Histórias:** MO-501  
**PRD:** 5.4, D-02

## Context

A visão Ano usa a mesma competência do Resumo e do Orçamento. O saldo desta tela é o saldo final, receitas menos despesas, não o saldo do período.

## Goals

1. Mostrar janeiro a dezembro do ano civil, com alternância Planejado / Realizado.
2. Expandir o tipo até a categoria, não até o item.
3. Destacar valor negativo e permitir rolagem horizontal.

## Non-goals

- Alerta próprio desta tela.
- Edição de valor na tabela.
- Intervalo que não seja o ano civil.

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Saldo final | Receitas 500000 e despesas 240000 no mesmo modo (planejado ou realizado) | 260000 centavos, rótulo “Saldo final” |
| Modo | Alternar Planejado / Realizado | A tabela inteira troca de fonte; o outro modo não se mistura na mesma célula |
| Expansão | Toque no tipo | Mostra as categorias desse tipo, mês a mês e no total. Não mostra item |
| Competência | Compra de cartão em 26/05 com fechamento 25 | O valor entra em junho, no mesmo mês das outras telas |
| Negativo | Saldo final < 0 | O número fica destacado |
| Ano | Seta de ano | Troca o ano civil exibido |

## Acceptance criteria

- [x] AC-501.1 Planejado e Realizado não se misturam na mesma leitura.
- [x] AC-501.2 Expandir o tipo mostra categorias e não itens.
- [x] AC-501.3 O saldo final é receitas menos despesas do modo selecionado.
- [x] AC-501.4 A competência do cartão é a mesma da spec 006.

## Test plan

Unit: saldo final na `reconciliacao.test.ts`.  
E2E: alternar o modo e expandir um tipo.

## Open questions

Nenhuma. D-02.

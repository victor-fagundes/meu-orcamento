# Spec: 012 — Resumo cards + gráficos (MO-601, MO-602)

**Status:** `verified`  
**Release:** A  
**Sprint:** 5  
**Histórias:** MO-601, MO-602  
**PRD:** 5.2, D-02, D-09

## Context

O Resumo lê a mesma competência do Orçamento. O filtro é o mês, mais pagamento e categoria. Não há intervalo livre de datas (D-09).

## Goals

1. Mostrar total orçado, total gasto, saldo do período e cards por tipo.
2. Filtrar por forma de pagamento e por categoria. Limpar filtros volta os dois para Todas e não muda o mês.
3. Com pagamento diferente de Todas, orçado e saldo do período mostram “—”.
4. Rosca de no máximo 4 categorias mais “Outros”, barras planejado × realizado e média diária no mês corrente.
5. O banner e o sininho desta tela usam a mesma lista de alertas da spec 011.

## Non-goals

- Intervalo início/fim (D-09).
- Seção Insights e indicador de endividamento.
- Regra de alerta diferente da spec 011.

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Saldo do período | Orçado de despesas 300000, gasto 240000 | 60000 centavos, rótulo “Saldo do período” |
| Pagamento filtrado | Um cartão | Gasto e realizado só desse meio; orçado e saldo mostram “—” |
| Categoria | Uma categoria | Cards restritos aos itens dela; a rosca é substituída pelo texto “Rosca oculta com filtro de categoria. Limpe o filtro para ver a composição.” |
| Rosca | 5 ou mais categorias com gasto | As 4 maiores e o restante em “Outros” |
| Rosca vazia | Gasto de despesa 0 | Empty state, sem fatias |
| Barras | Sem dados | Eixos vazios |
| Média | Mês corrente, dia D, gasto G | round(G / D) centavos e dias restantes = último dia do mês − D |
| Outro mês | Competência diferente do mês civil atual | Média diária e dias restantes não aparecem |
| Card | Toque no total gasto | Abre Lançamentos dessa competência. O href leva `mes` (spec 025; antes o link ia para Lançamentos sem mês) |
| Card | Toque no orçado ou no tipo | Abre Orçamento dessa competência |

## Acceptance criteria

- [x] AC-601.1 Filtro de cartão deixa o gasto filtrado e orçado/saldo em “—”.
- [x] AC-601.2 Cards de gasto abrem Lançamentos; cards de orçado abrem Orçamento, na mesma competência.
- [x] AC-601.3 “Limpar filtros” volta pagamento e categoria para Todas e mantém o mês.
- [x] AC-602.1 Rosca com no máximo 4 categorias mais Outros; sem despesa, empty state.
- [x] AC-602.2 Barras por tipo, com título e aria-label. Filtro de categoria esconde a rosca com a frase da tabela.
- [x] AC-602.3 Média diária e dias restantes só no mês corrente.
- [x] AC-602.4 Banner e sininho seguem a spec 011.

## Test plan

Unit: saldo do período na `reconciliacao.test.ts`.  
E2E: filtrar um cartão, limpar, abrir o sininho.

## Open questions

Nenhuma. D-09.

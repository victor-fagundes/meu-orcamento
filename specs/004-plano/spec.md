# Spec: 004 — Planejamento mensal (MO-203)

**Status:** `verified`  
**Release:** A  
**Sprint:** 2  
**Histórias:** MO-203  
**PRD:** 5.6, D-08

## Context

Cada item tem 12 inteiros de centavos, janeiro a dezembro do ano em edição. O realizado não entra nesta história.

## Goals

1. Abrir o planejamento pelo item no Orçamento e salvar 12 centavos ≥ 0.
2. “Aplicar a todos” copia um valor para os 12 meses.
3. “Copiar mês anterior” copia só para o mês corrente o valor do mês anterior. Em janeiro não muda nada.
4. “Copiar ano anterior” não altera valores e informa que não há plano de outro ano (D-08).

## Non-goals

- Lançamento e realizado (MO-303).
- Resumo (MO-601).
- Guardar plano de anos anteriores.

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Salvar | 12 valores ≥ 0 com até 2 casas | Persistidos como inteiros de centavos; o total do mês no Orçamento usa esses inteiros |
| Negativo ou texto | Um dos 12 campos | Não salva; o campo mostra o erro |
| Aplicar a todos | 650000 centavos | Os 12 meses ficam 650000 |
| Copiar mês anterior | Plano `[100,200,300,0×9]`, mês índice 2 (março) | `[100,200,200,0×9]` |
| Janeiro | Mês índice 0 | O plano não muda |
| Copiar ano anterior | Qualquer plano | O plano devolvido é o mesmo; a UI diz que a cópia não está disponível |

## Acceptance criteria

- [x] AC-203.1 O sheet abre a partir do item no Orçamento.
- [x] AC-203.2 Salvar persiste 12 inteiros de centavos e atualiza o total do mês.
- [x] AC-203.3 “Aplicar a todos” replica um valor nos 12 meses.
- [x] AC-203.4 “Copiar mês anterior” preenche só o mês corrente. Janeiro não muda.
- [x] AC-203.5 “Copiar ano anterior” não altera os 12 valores e mostra que a cópia não está disponível.
- [x] AC-203.6 Valor negativo ou não numérico não é salvo.

## Test plan

Unit: `src/domain/plano.test.ts`.

## Open questions

Nenhuma. D-08.

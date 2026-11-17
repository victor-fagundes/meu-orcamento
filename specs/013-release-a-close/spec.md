# Spec: 013 — Fechamento Release A (MO-1002, MO-1102)

**Status:** `verified`  
**Release:** A  
**Sprint:** 6  
**Histórias:** MO-1002, MO-1102  
**PRD:** 5.11, 6, D-06

## Context

MO-1002 apaga a conta. MO-1102 é a suíte que confere se Resumo, Orçamento e Ano usam os mesmos números da seção 6 do PRD.

## Goals

1. Excluir a conta só se o usuário digitar EXCLUIR.
2. A exclusão apaga na hora o usuário e, em cascade, sessão, orçamento, itens, cartões e lançamentos (D-06).
3. A suíte de reconciliação cobre os casos da seção 6.

## Non-goals

- Retenção de 30 dias.
- Trilha de auditoria separada.
- Desfazer a exclusão da conta.

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Frase errada | “excluir ” com espaço no meio, ou “APAGAR” | Nenhum registro sai; a tela mostra “Digite EXCLUIR para confirmar.” |
| Frase certa | EXCLUIR, em qualquer caixa, com espaços nas pontas | A conta deixa de existir; a sessão acaba |
| Cascade | Conta com itens, cartões e lançamentos | Esses registros deixam de existir junto com a conta |
| Falha | O banco recusa o delete | A ação devolve o erro e a conta continua |
| Reconciliação | Casos da seção 6 | Parcelas 3334+3333+3333; competência 10/05, 25/05 e 26/05; edição e exclusão por escopo; alertas 80/100/105 e sem plano; saldo do período 60000 e saldo final 260000; filtro de cartão com orçado “—” |

## Acceptance criteria

- [x] AC-1002.1 Digitar EXCLUIR apaga a conta e o orçamento. Outra frase não apaga.
- [x] AC-1002.2 Itens, cartões, lançamentos e sessão dessa conta não existem depois da exclusão.
- [x] AC-1102.1 `reconciliacao.test.ts` cobre os casos da seção 6 listados na tabela.

## Test plan

Unit: `src/domain/reconciliacao.test.ts`.  
E2E: frase errada permanece logado; EXCLUIR volta para o login e o mesmo e-mail não entra.

## Open questions

Nenhuma. D-06.

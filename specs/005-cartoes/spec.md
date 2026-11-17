# Spec: 005 — Cadastro de cartões (MO-301)

**Status:** `verified`  
**Release:** A  
**Sprint:** 2  
**Histórias:** MO-301  
**PRD:** 5.7

## Context

O cartão guarda apelido e, se o usuário informar, o dia de fechamento. A competência em si é a história MO-302. Aqui o teste é o cadastro e o seletor.

## Goals

1. Criar cartão com apelido obrigatório. Fechamento, vencimento, instituição e últimos 4 dígitos são opcionais.
2. Sem dia de fechamento, o card do cartão mostra o aviso de que a competência será o mês da compra.
3. Inativar é soft-delete: o cartão sai do seletor de novos lançamentos e continua na lista de inativos.

## Non-goals

- Calcular competência (MO-302).
- Criar lançamento (MO-303).
- Apagar cartão que já tem lançamento.

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Apelido vazio | Confirmar | Nada é gravado; erro no apelido |
| Sem fechamento | Cartão só com apelido | Gravado; o card mostra “Sem dia de fechamento” |
| Fechamento | Inteiro de 1 a 28 | Gravado nesse cartão |
| Fora de 1–28 | 0, 29 ou texto | Não grava o fechamento; erro no campo |
| Inativar | Cartão ativo | Sai de `listCartoesAtivos`; a lista de Ajustes ainda o mostra como inativo |
| Lançamento novo | Seletor | Só cartões ativos |

## Acceptance criteria

- [x] AC-301.1 Criar cartão com apelido em Ajustes.
- [x] AC-301.2 Sem dia de fechamento, o card mostra “Sem dia de fechamento”.
- [x] AC-301.3 Inativar tira o cartão do seletor de ativos e a lista mostra o inativo.
- [x] AC-301.4 Apelido vazio não grava.
- [x] AC-301.5 Dia de fechamento fora de 1–28 não é gravado.

## Test plan

Unit: lista de ativos exclui inativos.  
E2E: criar, ver aviso, inativar, abrir seletor de lançamento.

## Open questions

Nenhuma.

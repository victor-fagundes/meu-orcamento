# Spec: 003 — CRUD de itens (MO-202)

**Status:** `verified`  
**Release:** A  
**Sprint:** 2  
**Histórias:** MO-202  
**PRD:** 5.9, 5.3, D-07

## Context

O usuário inclui um item no tipo que está vendo e pode arquivá-lo. Arquivar esconde o item dos fluxos novos e conserva os lançamentos já gravados.

## Goals

1. Criar item no tipo ativo, com categoria já existente ou nome novo, e nome do item obrigatório.
2. Arquivar é soft-delete: o item sai da lista ativa do Orçamento e do seletor de lançamento.
3. Lançamentos já ligados ao item continuam na lista, com o mesmo valor e a mesma competência.

## Non-goals

- Renomear item ou categoria (D-07).
- Reordenar (D-07).
- Exclusão física do item.
- Editar plano de 12 meses (MO-203).
- Criar lançamento (MO-303).

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Nome vazio | Confirmar novo item sem nome | Nada é gravado; o campo mostra o erro |
| Categoria | Texto igual a uma categoria do tipo, ignorando maiúsculas | O item entra nessa categoria |
| Categoria nova | Texto que não existe no tipo | Nasce a categoria e o item dentro dela |
| Arquivar | Item com ou sem lançamento | Sai da lista ativa e do seletor; os lançamentos antigos permanecem |
| Seletor | Abrir novo lançamento | Itens arquivados não aparecem |
| Ajustes | Lista de arquivados | O item arquivado aparece nessa lista |

## Acceptance criteria

- [x] AC-202.1 “Novo item” no Orçamento grava o item no tipo selecionado e ele aparece na lista desse tipo.
- [x] AC-202.2 A categoria aceita uma existente ou um texto novo.
- [x] AC-202.3 Arquivar tira o item da lista ativa do Orçamento.
- [x] AC-202.4 O seletor de lançamento não lista arquivados.
- [x] AC-202.5 Ajustes lista os itens arquivados.
- [x] AC-202.6 Nome vazio não grava item.
- [x] AC-202.7 Lançamento já salvo de um item arquivado continua na lista, com o mesmo valor.

## Test plan

Unit: seletor exclui arquivados.  
E2E: criar, arquivar, conferir seletor e lançamento antigo.

## Open questions

Nenhuma.

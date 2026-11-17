# Spec: 008 — Listar e buscar lançamentos (MO-304)

**Status:** `verified`  
**Release:** A  
**Sprint:** 3  
**Histórias:** MO-304  
**PRD:** 5.5, Q-03

## Context

A lista mostra a competência selecionada, não o calendário da data da compra. Uma compra de cartão em 26/05 com fechamento no dia 25 aparece em junho e continua ordenada pela data da compra.

## Goals

1. Listar a competência aberta, da data mais nova para a mais antiga.
2. Buscar na descrição e no nome do item, só dentro dessa competência.
3. Filtrar por forma de pagamento e por tipo (receita ou despesa).
4. Sem resultado, a mensagem oferece limpar busca e filtros.
5. Linha parcelada mostra “Parcela N de T · restam X”, com X = T − N.

## Non-goals

- Busca no histórico inteiro (Q-03).
- Criar, editar ou excluir, além de abrir essas ações a partir da linha.

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Mês | Competência 2026-06 | Só linhas com competência 2026-06 |
| Ordem | Duas datas na mesma competência | A data maior vem primeiro |
| Busca | Texto que não está na descrição nem no item | Lista vazia, mensagem e ação de limpar |
| Filtro | Forma ou tipo sem linha | Mesma mensagem de lista vazia |
| Limpar | Acionar limpar | Busca vazia, forma Todas, tipo sem recorte; o mês não muda |
| Parcela | N=2, T=6 | Texto “Parcela 2 de 6 · restam 4” |
| À vista | Sem grupo | Sem texto de parcela |

## Acceptance criteria

- [x] AC-304.1 A busca só olha a competência carregada.
- [x] AC-304.2 Sem resultado, a tela mostra a mensagem e limpa busca e filtros.
- [x] AC-304.3 Parcela 2 de 6 mostra “Parcela 2 de 6 · restam 4”.
- [x] AC-304.4 Filtro de forma de pagamento e filtro de tipo restringem a mesma lista.
- [x] AC-304.5 A ordenação é pela data da compra, decrescente, dentro da competência.

## Test plan

E2E: competência junho contém a compra de 26/05 com fechamento 25; a busca “xyz” mostra o vazio; limpar restaura a lista.

## Open questions

Nenhuma. Q-03 decidida: busca só no mês selecionado, e o mês é a competência.

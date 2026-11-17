# Spec: 010 — Excluir com desfazer (MO-306)

**Status:** `verified`  
**Release:** A  
**Sprint:** 3  
**Histórias:** MO-306  
**PRD:** 5.5

## Context

Excluir grava a remoção na hora. O toast de 10 segundos guarda, na tela, os registros removidos e consegue recolocá-los. Depois dos 10 segundos essa cópia some.

## Goals

1. Perguntar o escopo: somente esta, esta e as próximas, ou todas as parcelas do grupo, e quantas linhas serão removidas.
2. Confirmar apaga essas linhas.
3. Desfazer, dentro de 10 segundos, restaura as mesmas linhas, sem duplicar.
4. Depois de 10 segundos não há segundo desfazer.

## Non-goals

- Lixeira permanente.
- Desfazer depois de recarregar a página.
- Excluir a conta (MO-1002).

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Só esta | 3ª de 6 | Sai só a 3ª; as outras cinco e o vínculo das restantes permanecem |
| Esta e as próximas | 3ª de 6 | Saem a 3ª, a 4ª, a 5ª e a 6ª |
| Todas | Qualquer parcela do grupo | Saem todas as parcelas do grupo |
| Confirmação | Cancelar | Nenhuma linha sai |
| Desfazer | Toast acionado em até 10s | As linhas voltam com os mesmos id, valores, datas, competências, itens e grupo |
| Prazo | 10s sem desfazer | O toast some; as linhas não estão no banco; não há outro controle de desfazer |
| Recarregar | Página atualizada com o toast aberto | As linhas continuam apagadas e o toast não volta |

## Acceptance criteria

- [x] AC-306.1 Excluir e desfazer dentro de 10s restaura as mesmas linhas, sem duplicar.
- [x] AC-306.2 Os três escopos removem só as parcelas descritas na tabela.
- [x] AC-306.3 Aos 10s o toast some, as linhas não existem e não há outro desfazer.
- [x] AC-306.4 Cancelar a confirmação não remove linha.
- [x] AC-306.5 Recarregar a página durante o toast não restaura as linhas.

## Test plan

Unit: escopos de exclusão.  
E2E: excluir, desfazer, excluir de novo e esperar 10s.

## Open questions

Nenhuma.

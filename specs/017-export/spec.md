# Spec: 017 — Exportar CSV e JSON (MO-1001)

**Status:** `verified`  
**Release:** B  
**Histórias:** MO-1001  
**PRD:** 5.11

## Context

A exportação entrega o orçamento de quem está logado, para abrir fora do app. O valor continua inteiro, em centavos.

## Goals

1. Exportar itens com plano, cartões e lançamentos em JSON e em CSV.
2. Não arredondar nem converter para número decimal no arquivo.

## Non-goals

- Exportar o PDF de fatura.
- Exportar dados de outro usuário.
- Incluir senha, e-mail ou sessão.

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| JSON | Orçamento com dados | Objeto com itens, planos em 12 inteiros, cartões e lançamentos |
| CSV | O mesmo orçamento | As mesmas entidades, valor só como inteiro de centavos |
| Vazio | Orçamento sem lançamento | O arquivo sai com as coleções vazias de lançamento e com os itens existentes |
| Centavos | Lançamento de 3334 | O arquivo contém 3334, não 33,34 |
| Falha | Erro ao montar o arquivo | A tela mostra o erro e nenhum arquivo incompleto é baixado |
| Sessão | Usuário sem sessão | Não exporta |

## Acceptance criteria

- [x] AC-1001.1 O arquivo inclui lançamentos, itens, planejamento e cartões da conta logada.
- [x] AC-1001.2 Todo valor monetário do arquivo é inteiro de centavos.
- [x] AC-1001.3 Orçamento sem lançamento gera arquivo com lista de lançamentos vazia.
- [x] AC-1001.4 Outra conta não aparece no arquivo.

## Test plan

Unit: serialização de um lançamento de 3334 centavos.  
E2E: baixar JSON e CSV e conferir a ausência de e-mail.

## Open questions

Nenhuma.

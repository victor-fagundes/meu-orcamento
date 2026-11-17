# Spec: 018 — Telemetria mínima (MO-1101)

**Status:** `verified`  
**Release:** B  
**Histórias:** MO-1101  
**PRD:** 3

## Context

O MVP escreve o evento no console, com propriedades numéricas. Não há identificador de pessoa, e-mail, nome ou descrição de lançamento.

## Goals

1. Registrar os eventos da tabela, no momento em que a ação acontece.
2. Descartar propriedade cujo nome pareça dado pessoal.

## Non-goals

- Enviar o evento para um coletor externo.
- Guardar o texto da descrição, o nome do item ou o e-mail.

## Domain rules

| Evento | Quando | Propriedades |
|---|---|---|
| lancamento_criado | Depois que o grupo é gravado | quantidade |
| lancamento_editado | Depois que a edição é gravada | quantidade |
| lancamento_excluido | Depois que as linhas saem | quantidade |
| navegacao_mes | Toque na seta de mês em Resumo, Orçamento ou Lançamentos | destino, no formato YYYY-MM |
| sessao_duracao | Ao sair da aba autenticada | segundos, inteiro > 0 |
| alerta_acionado | A tela mostra ao menos um alerta | quantidade |
| import_planilha_iniciada | A planilha foi lida para a prévia | kind, rowCount |
| import_planilha_confirmada | A confirmação terminou | contagens numéricas do relatório |
| import_pdf_iniciada | O PDF foi lido para a prévia | contagem de linhas |
| import_pdf_confirmada | A confirmação do PDF terminou | contagens numéricas |
| export_iniciado | O download começa | format = json ou csv |
| Qualquer um | Propriedade email, nome, name, desc, descricao, cpf ou phone | A propriedade não entra no evento |

Desfazer exclusão não gera `lancamento_criado`.

## Acceptance criteria

- [x] AC-1101.1 Criar, editar, excluir, mudar de mês, ver alerta, importar planilha, importar PDF e exportar emitem o evento da tabela.
- [x] AC-1101.2 Sair da aba emite `sessao_duracao` com segundos > 0.
- [x] AC-1101.3 Propriedade com nome de dado pessoal é omitida.
- [x] AC-1101.4 O texto da descrição do lançamento não é argumento de nenhum evento.

## Test plan

Unit: o filtro de chaves em `src/lib/telemetry.ts` não copia `descricao`.  
Manual: o console mostra `[telemetry]` ao criar um lançamento, sem o texto da descrição.

## Open questions

Nenhuma.

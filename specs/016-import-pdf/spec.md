# Spec: 016 — Importação de fatura PDF (MO-901, MO-902, MO-903)

**Status:** `verified`  
**Release:** B  
**Histórias:** MO-901, MO-902, MO-903  
**PRD:** 5.13, Q-07, D-04

## Context

O PDF é lido em memória e não fica guardado. O cartão de destino é obrigatório. A competência e as parcelas seguem as specs 006 e 007.

## Goals

1. Aceitar PDF com texto selecionável e recusar PDF sem texto.
2. Mostrar prévia editável, sem gravar.
3. Confirmar gera lançamentos no cartão escolhido.

## Non-goals

- OCR de PDF escaneado (Q-07).
- Guardar o arquivo.
- Importar sem cartão de destino.

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Sem texto | PDF de imagem | Erro: “Este PDF parece ser uma imagem. Baixe o PDF original no app do banco (com texto selecionável) ou lance manualmente.” Nada é gravado |
| Sem cartão | Confirmar | Não grava |
| Totais | Linha de total, pagamento, juros ou IOF | Não vira lançamento |
| Prévia | Antes de confirmar | Nenhuma linha está no banco |
| Editar | Usuário muda valor, descrição ou ignora a linha | Só o que ficou na prévia pode ser confirmado |
| Estorno | Linha de estorno | O usuário escolhe, na prévia, lançar como receita no item que indicar ou ignorar a linha |
| Confirmar | Cartão com fechamento | Cada linha usa a competência da spec 006 e, se houver “3/12”, as parcelas da spec 007 |
| Arquivo | Depois da confirmação | O PDF não fica armazenado |

## Acceptance criteria

- [x] AC-901.1 PDF com texto produz linhas. PDF sem texto mostra a mensagem da tabela e não grava.
- [x] AC-902.1 A prévia não grava. Totais, pagamento, juros e IOF não viram lançamento.
- [x] AC-902.2 Estorno só entra se o usuário escolher lançar como receita e indicar o item.
- [x] AC-903.1 Editar ou ignorar linha na prévia muda o que a confirmação grava.
- [x] AC-903.2 Confirmar grava no cartão escolhido, com competência e parcelas, e o relatório diz quantas linhas entraram.
- [x] AC-903.3 O PDF não permanece gravado depois da confirmação.

## Test plan

Unit: parser ignora totais.  
E2E: prévia, ignorar uma linha, confirmar, conferir a competência do cartão.

## Open questions

Nenhuma. Q-07 fechada: sem OCR.

# Decisões assumidas — Meu Orçamento (refino v1.0)

*Decisões de produto tomadas para destravar histórias e Sprint 1. Revisar com Victor antes de contrato/fechamento de escopo.*

---

## Q-05 · Compra no dia do fechamento

**Decisão assumida (D-04):** Compra **no dia do fechamento** vai para a **fatura do mês seguinte** (regra Inter).

**UX:** Aviso no cadastro do cartão: *"Alguns bancos podem tratar o dia do fechamento de forma diferente. Confira no app do seu cartão."*

**MVP:** Sem override manual de competência por lançamento (fica para fase 2).

---

## Q-06 · Duplicidade na reimportação

**Decisão assumida (D-05):** Duplicata = mesma **data** + **valor (centavos)** + **descrição normalizada** (trim, lower, sem acento) + **meio de pagamento** (incl. cartão id).

**Comportamento:**
- Na prévia: linha marcada como *possível duplicata* (não importa por padrão).
- Checkbox por linha: *Importar mesmo assim*.
- Reimportação do mesmo arquivo: modal de confirmação + resumo de duplicatas.

---

## Q-07 · PDF escaneado

**Mantido fora do MVP.** Mensagem: *"Este PDF parece ser uma imagem. Baixe o PDF original no app do banco (com texto selecionável) ou lance manualmente."*

---

## Golden files (fixtures de QA)

Usar arquivos reais do Victor como baseline:

| Fixture | Caminho sugerido |
|---------|------------------|
| Planilha controle | `Controle_Financeiro_Victor_Atualizado.xlsx` (Downloads) |
| Export cartão | `fatura-inter-2026-12.csv` (Downloads) |
| PDF Inter | PDF de fatura Inter com texto (adicionar quando disponível) |

**Meta Release B:** ≥ 90% das linhas de compra corretas no Inter; ≥ 80% no parser genérico.

---

## Fatiamento de release (confirmado para planejamento)

| Release | Conteúdo | Critério de go-live |
|---------|----------|---------------------|
| **A** | Épicos 1–7 + MO-1102 | Usuário planeja, lança, acompanha, alerta — sem import |
| **B** | Épicos 8–9 + export + telemetria | Migração planilha + PDF |

---

## D-06 · Exclusão de conta

Imediata, depois de digitar EXCLUIR. Apaga a conta e, em cascade, o orçamento, os itens, os cartões, os lançamentos e a sessão. Frase diferente não apaga. Sem retenção de 30 dias nesta versão.

## D-07 · Renomear e reordenar

Fora desta versão. O MVP cria e arquiva item.

## D-08 · Copiar ano anterior

A ação informa que não há plano de outro ano e não altera os doze valores.

## D-09 · Filtro de período do Resumo

Mês de competência, pelas setas. Intervalo livre de datas fica fora desta versão. “Limpar filtros” zera pagamento e categoria, não o mês.

---

*08/11/2026 · complementado em 16/11/2026*

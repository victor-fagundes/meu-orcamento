---
project: Meu Orçamento
ref: docs/PRD_Meu_Orcamento_v1_0.txt (planejar o mês por tipo e grupo; consumo visível)
topic: orcamento
discipline: components
author: pd-design-system
date: 2026-11-16
status: draft
upstream: [2026-11-16-design-orcamento.md, 2026-11-16-visual-orcamento.md]
downstream: [qa, handoff]
---

## Summary

A tela Orçamento usa três peças do módulo Material (`MdFilterChip`, `MdProgress`, `MdOutlinedButton`) e o resto em elemento nativo com classe. Cor de superfície e texto resolve em `--md-sys-color-*`. Tipo, espaço, raio e a cor de aviso não têm token. A lista foi relida em `src/components/material/ui.tsx`, `material-theme.css` e `globals.css` nesta data.

## Assumptions

- Roster parcial no sentido do adapter de código: não há Storybook. As variantes são as props exportadas em `ui.tsx`. Estados internos de hover e foco dos web components Material não foram inspecionados.
- Nomes provisórios não foram criados.

Learnings applied: L-001

Sincronia: arquivos locais, adapter `code.md`, degrau 2 (sem MCP de design).

## Mapeamento

| Elemento | Componente · variante | Tipo | Tokens | Estados | Status |
|---|---|---|---|---|---|
| Tipo Receitas / Fixas / Variáveis / Anuais | `MdFilterChip` `label`, `selected` true/false | sem role; o chip herda `--md-ref-typeface-plain` | cor do chip é do web component, não nomeada nesta tela | default, selected | OK |
| Barra ok | `MdProgress` `tone=ok` `value` 0–1 | — | `--md-sys-color-primary` | default | OK |
| Barra estourado ou atingido | `MdProgress` `tone=over` | — | `--md-sys-color-error` | default | OK |
| Barra preventiva | `MdProgress` `tone=warn` | — | nenhum; o indicador é `#ffe600` | default | gap → backlog |
| Novo item | `MdOutlinedButton` | face `--md-ref-typeface-plain` | cor do web component | default; disabled existe na prop e esta tela não usa | OK |
| Título, mês, totais, nomes | elementos de texto (`.orc-title`, `.orc-month`, `.orc-total`, `.orc-cat-head`, `.orc-item-name`) | px crus, sem role | `--md-sys-color-on-surface`, `--md-sys-color-on-surface-variant` | default | substituted |
| Cartão do total e do grupo | `div.orc-total`, `div.orc-cat` | — | `--md-sys-color-surface-container-low`, `--md-sys-color-surface-container-lowest`; raio 16px sem token | default | substituted |
| Mês anterior / próximo | `Link.orc-mes-btn` | 22px cru | `--md-sys-color-on-surface-variant` | default | gap → backlog |
| Cabeçalho do grupo | `button.orc-cat-head` | `font: inherit`, peso 500 | `--md-sys-color-on-surface` | default, aberto (▴) / fechado (▾) | substituted |
| Frase preventiva | `p.orc-hint.est-preventivo` | 12px | nenhum; `#9a6700` | default | gap → backlog |
| Frase de estouro, atingido e sem plano | `p.orc-hint` com essas classes | 12px | nenhum; `#c62828` (o token de erro é `#ba1a1a`) | default | gap → backlog |
| Item sem plano | `div.orc-item.sem-plan` | — | nenhum; fundo `#fff5f5` | default | gap → backlog |

`substituted` aqui quer dizer: a peça existe como HTML e classe, e a cor que dá para nomear usa token. Não existe um componente de lista ou de cartão no módulo Material para citar no lugar.

## Flagged gaps

Ver `design-system/SYSTEM-BACKLOG.md`. Nenhum é bloqueante: a tela já renderiza com a substituição citada.

## Not verified

- Contraste de hover, foco e disabled de `md-filter-chip` e `md-outlined-button`.
- Tema escuro (`prefers-color-scheme: dark` em `material-theme.css`).
- Medida do alvo de Arquivar.
- Foco ao abrir o sheet de plano ou de novo item.

---
project: Meu Orçamento
ref: docs/PRD_Meu_Orcamento_v1_0.txt (planejar o mês por tipo e grupo; consumo visível)
topic: orcamento
discipline: visual
author: pd-visual-design
date: 2026-11-16
status: draft
upstream: [2026-11-16-design-orcamento.md]
downstream: [components, qa, handoff]
---

## Summary

A hierarquia da tela Orçamento apoia a leitura do total e dos grupos. Cor de superfície, texto e primária vêm de `--md-sys-color-*`. Tamanho, espaço e raio não têm token. O amarelo da barra de aviso é o mesmo valor de `--md-sys-color-tertiary-container` (`#ffe600`) e, sobre o branco, fica em 1,27:1.

## Assumptions

- Tema claro de `material-theme.css`, que é o `:root` lido. O bloco escuro existe e não foi aplicado nesta conta.
- Não há artefato de copy. Os textos usados são os que a tela já mostra.

Learnings applied: L-001

## Tipo

Não há `role/*` nem `--md-sys-typescale-*`. Os tamanhos abaixo são os do CSS, não tokens.

| Elemento | Tratamento real | Cor |
|---|---|---|
| Título "Orçamento" | 28px / 36px, peso 400 | `--md-sys-color-on-surface` via `--on-sf` no `body` |
| Nome do mês | 16px / 24px, peso 500 | `--md-sys-color-on-surface` (`--on-sf`) |
| Rótulo antigo `.orc-month` fora da navegação | 14px | `--md-sys-color-on-surface-variant` (`--on-sv`) |
| Total do tipo | 14px, peso 500 | `--md-sys-color-on-surface` |
| Cabeçalho do grupo | `font: inherit` (o `body` não declara tamanho), peso 500 | `--md-sys-color-on-surface` via `--on-sf` |
| Nome do item | 14px, peso 500 (herda de `.orc-item`) | `--md-sys-color-on-surface` |
| Valor planejado (`.muted`) | mesmo tamanho do pai, peso 400 | `--md-sys-color-on-surface-variant` |
| Subtítulo do item e frase de consumo no estado ok | 12px | `--md-sys-color-on-surface-variant` |
| Face | `--md-ref-typeface-plain` | — |

## Cor

| Uso | Token |
|---|---|
| Fundo da página | `--md-sys-color-surface` (`--sf`) |
| Cartão do total | `--md-sys-color-surface-container-low` |
| Cartão do grupo | `--md-sys-color-surface-container-lowest` |
| Texto principal | `--md-sys-color-on-surface` |
| Texto secundário | `--md-sys-color-on-surface-variant` |
| Barra `tone=ok` | `--md-sys-color-primary` |
| Barra `tone=over` | `--md-sys-color-error` |
| Divisor do item | `--md-sys-color-outline-variant` (`--olv`) |

Fora do sistema:

| Uso | Valor no CSS | Por que não é token |
|---|---|---|
| Barra `tone=warn` | `#ffe600` dentro de `MdProgress` | Igual a `--md-sys-color-tertiary-container`, mas escrito cru. Esse token é recipiente terciário, não um papel de aviso. |
| Frase preventiva | `#9a6700` | Não existe em `material-theme.css`. |
| Frase atingido, estourado e sem plano | `#c62828` | Não é `--md-sys-color-error` (`#ba1a1a`). |
| Fundo do item sem plano | `#fff5f5` | Não existe no tema. |

## Espaço, raio, elevação

Não há token de espaço, raio ou elevação. O que a tela usa: folga 8px entre grupos, padding 14px 16px no total, 12px 16px no cabeçalho e no item, raio 16px nos cartões, 20px (círculo) nos botões de mês, altura 6px na barra. Elevação: nenhuma; a separação é superfície contra superfície.

## Contraste (tema claro, pares resolvidos)

Método: razão WCAG a partir dos hex de `material-theme.css` e dos hex crus do bloco Orçamento. Não é uma auditoria da tela renderizada.

| Par | Razão | Alvo AA | Resultado |
|---|---|---|---|
| `#191c20` sobre `#f8f9ff` (título e corpo) | 16,27:1 | 4,5:1 texto | passa |
| `#43474e` sobre `#f2f3fb` (secundário no cartão do total) | 8,44:1 | 4,5:1 | passa |
| `#43474e` sobre `#f8f9ff` | 8,88:1 | 4,5:1 | passa |
| `#0058be` sobre `#f8f9ff` | 6,37:1 | 4,5:1 se for texto; 3:1 se for traço | passa |
| `#ba1a1a` sobre `#f8f9ff` (token de erro) | 6,15:1 | 4,5:1 | passa |
| `#9a6700` sobre `#f8f9ff` (frase preventiva) | 4,63:1 | 4,5:1 | passa no texto; o valor não é token |
| `#c62828` sobre `#f8f9ff` | 5,35:1 | 4,5:1 | passa no texto; o valor não é token |
| `#ffe600` sobre `#ffffff` (barra de aviso no cartão mais claro) | 1,27:1 | 3:1 para componente de interface | não passa |

A frase de consumo continua ao lado da barra, então o estado não depende só da cor. O indicador gráfico do aviso, sozinho, fica abaixo de 3:1.

Hover, foco e disabled dos chips e do botão delineado não foram medidos. O componente Material desenha esses estados; esta passagem não leu o CSS interno deles.

## Flagged gaps

- Escala de tipo, espaço e raio ausente. Substituição: os px já citados. Não bloqueia a tela.
- Barra de aviso em `#ffe600` a 1,27:1. Não bloqueia a leitura porque a frase existe. Severidade alta no backlog.

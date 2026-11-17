# Design-system backlog

## 2026-11-16 — botão de ícone para o mês

- **Flagged by:** pd-ux-design em `2026-11-16-design-orcamento.md`
- **Needed:** controle de 40×40 para mês anterior e próximo, com nome acessível.
- **Why existing parts didn't fit:** `ui.tsx` exporta filled, outlined e text button, não um botão de ícone.
- **Substitution used meanwhile:** `Link` com classe `orc-mes-btn`.
- **Severity:** Medium
- **Blocking:** no
- **Status:** open
- **Decision:**

## 2026-11-16 — indicador de aviso com contraste

- **Flagged by:** pd-visual-design em `2026-11-16-visual-orcamento.md`
- **Needed:** cor de aviso para `MdProgress tone=warn` com pelo menos 3:1 sobre `--md-sys-color-surface-container-lowest`.
- **Why existing parts didn't fit:** o código pinta `#ffe600`, igual a `--md-sys-color-tertiary-container`. Sobre `#ffffff` a razão medida foi 1,27:1. O token terciário não é um papel de status.
- **Substitution used meanwhile:** hex cru, com a frase de consumo ao lado.
- **Severity:** High
- **Blocking:** no
- **Status:** open
- **Decision:**

## 2026-11-16 — texto e fundo de status da lista

- **Flagged by:** pd-design-system em `2026-11-16-components-orcamento.md`
- **Needed:** papéis de cor para a frase preventiva, a frase de estouro e o fundo do item sem plano.
- **Why existing parts didn't fit:** `#9a6700`, `#c62828` e `#fff5f5` não estão em `material-theme.css`. `--md-sys-color-error` é `#ba1a1a`, outro valor.
- **Substitution used meanwhile:** hex cru nas classes `.orc-hint` e `.orc-item.sem-plan`.
- **Severity:** Medium
- **Blocking:** no
- **Status:** open
- **Decision:**

## 2026-11-16 — escala de tipo, espaço e raio

- **Flagged by:** pd-visual-design em `2026-11-16-visual-orcamento.md`
- **Needed:** roles de tipo e tokens de espaço e raio para título, mês, corpo, legenda, folga 8 e raio 16.
- **Why existing parts didn't fit:** o tema só declara `--md-ref-typeface-plain` e as cores `--md-sys-color-*`.
- **Substitution used meanwhile:** px no bloco Orçamento de `globals.css`.
- **Severity:** Medium
- **Blocking:** no
- **Status:** open
- **Decision:**

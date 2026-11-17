# Learnings — Meu Orçamento

## L-001 — Cor Material não torna px e hex de status em token

- **Applies to:** visual, components, design
- **What happened:** O tema em `src/app/material-theme.css` tem cor `--md-sys-color-*` e a face Roboto. A tela Orçamento ainda usa tamanho, espaço e raio em px, e o aviso/erro da barra em hex cru (`#ffe600`, `#c62828`, `#9a6700`).
- **Root cause:** O sistema vivo cobre cor. Escala tipográfica, espaço, raio e cor de status não foram tokenizados.
- **Rule for next time:** Citar `--md-sys-color-*` (ou o atalho `--sf`, `--pr`, `--on-sv`, `--er`) só quando o nome existe no arquivo. Px e hex de status entram como lacuna, não como token inventado.
- **Evidence:** Leitura de `material-theme.css` e `globals.css` (bloco Orçamento) em 2026-11-16, artefato `2026-11-16-visual-orcamento.md`.
- **Added:** 2026-11-16 · **Status:** active

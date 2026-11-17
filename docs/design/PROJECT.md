# Project profile — Meu Orçamento

product: Planejamento e controle do orçamento pessoal, no lugar da planilha Vida Financeira.
users:
  - Pessoa com conta própria, uso frequente, primeiro no celular e também no desktop
platforms: [web]

design_system:
  source: code
  locations:
    - src/app/material-theme.css
    - src/app/globals.css
    - src/components/material/ui.tsx
    - src/components/
conventions:
  type_roles: nenhum token de escala. Só --md-ref-typeface-plain / --md-ref-typeface-brand (Roboto). Tamanhos na tela Orçamento são px crus (28/36, 16/24, 14, 12).
  tokens: cor semântica Material --md-sys-color-*; atalhos em :root de globals.css (--sf, --s1, --pr, --on-pr, --pc, --on-pc, --on-sf, --on-sv, --ol, --olv, --er). --accent (#ffe600) e --ok (#2e7d32 / #81c784 no escuro) não são tokens --md-sys-*. Sem escala de espaço, raio ou elevação.
  component_props: MdFilterChip label/selected; MdFilledButton, MdOutlinedButton e MdTextButton children/disabled/type; MdTextField label; MdSelect label/value; MdProgress value (0–1) e tone ok|warn|over. Sem Storybook.

design_tool: code-only
requirements:
  tracker: brief-only
  reference: docs/PRD_Meu_Orcamento_v1_0.txt e specs/*/spec.md
analytics: none
domain_packs: []
compliance:
  accessibility: WCAG 2.2 AA
  regulatory: []

capabilities:
  checked: 2026-11-16
  connected: [cursor-ide-browser, web-search, shell, file-write]
  model: [vision, parallel-subagents]
  fallbacks:
    - "sem MCP de Figma, Penpot, Pencil, Sketch ou Framer: adapter code.md, leitura direta dos arquivos"
    - "sem Linear, Jira ou GitHub Issues: o PRD e as specs são o brief"
    - "telemetria só em console (src/lib/telemetry.ts): analytics none"

artifacts_dir: docs/design/
locale: [pt-BR]

notes: |
  Confirmado com o Victor em 2026-11-16. Primeiro recorte: tela Orçamento (spec, visual, mapeamento).
  Pesquisa, arquitetura, fluxos, mocks e QA ficaram de fora desse recorte.

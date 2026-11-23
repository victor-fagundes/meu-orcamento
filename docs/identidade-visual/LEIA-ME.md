# Identidade visual · Meu Orçamento (referência para o Cursor)

Esta pasta é a referência visual aprovada. Quando houver conflito entre o Design System e esta pasta, **esta pasta vale para a aparência**, e o DS vale para a estrutura de código (componentes, tokens, regras).

## Ordem de leitura
1. `decisoes/DECISOES_identidade_visual.md`: marca, cores, tipografia, layout, FAB (só mobile), formulários, estados e pendências.
2. `decisoes/DECISAO_padroes_de_interface.md`: nomes ("Disponível neste mês", "Sobra no ano"), Ajustes em dois grupos, categorias, verde de sucesso.
3. `decisoes/MICROCOPY.md`: textos.
4. `design-system-canvas/`: sistema visual (tokens, componentes, estados, grid, ícones, módulos, style guide). Abra os `.dc.html` no navegador; eles usam `tokens.css`.
5. `telas-web/`: telas aprovadas para o web (1280 px). **É a referência de aparência da Fase 1.**
6. `telas-app/`: telas do app (390 px). Referência para a Fase 2; no web, use só como apoio.

## Regras de aparência (resumo)
- Azul `#0058BE` é ação. Amarelo `#FFE600` é só marca. Texto `#191C20`.
- Fonte Manrope em tudo. Escala de 4 em 4 para espaço.
- Web: barra lateral de 240 px, conteúdo com margem de 40 px e 12 colunas. Sem FAB no web.
- Formulários: painel lateral de 460 px no web. Diálogo centralizado só para confirmação.
- Estados: vazio = título + frase + ação; erro com `role="alert"`; sucesso com snackbar.
- Saldo principal sempre com botão de ocultar valores.

## Como conferir uma tela
Compare a tela implementada com o artboard correspondente em `telas-web/` (mesmo nome, prefixo `web-`). Mesma hierarquia, mesmos textos, mesmos estados visíveis.

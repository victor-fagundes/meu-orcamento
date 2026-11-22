# Grid · Meu Orçamento · v0.2

Status: **proposta para aprovação**. Os valores estão em `tokens.css`.

## Celular (até 719 px)
- Largura de referência: **390 px**.
- **4 colunas**, margem lateral **16 px**, espaço entre colunas **16 px**.
- Conteúdo: 358 px. Cada coluna: 77,5 px.
- Uso: cartões ocupam a largura toda; grupos de dois campos ocupam 2 colunas.
- Barra inferior das 5 abas: **76 px** de altura. É medida de layout, como a barra lateral de 240 px, e não entra na escala de espaço.

## Desktop (a partir de 720 px)
- Largura de referência: **1280 px**.
- Barra lateral de **240 px** à esquerda.
- Área de conteúdo: 960 px (1280 − 240 − 2 × 40).
- **12 colunas**, margem lateral **40 px**, espaço entre colunas **24 px**.
- Cada coluna: 58 px. Conteúdo com largura máxima de 960 px.
- Uso: resumo em 2 blocos (6 + 6 colunas); tabela em 12 colunas; painel lateral de 460 px ocupa 5 colunas da área de conteúdo quando aberto.

## Regras
- Espaços entre blocos seguem a escala de espaço (16 ou 24 px). Não usar medidas fora da escala.
- Nenhum elemento fica fora da margem lateral, exceto barra de rolagem de tabela.
- Largura de texto de corpo: no máximo 72 caracteres; em desktop, texto longo não ultrapassa 6 colunas.
- O FAB no celular fica a 16 px da borda, o mesmo valor da margem.

## Como verificar
- No canvas, o artboard "Sistema · Grid" mostra as colunas sobrepostas.
- Ao criar uma tela, confirmar que o conteúdo começa e termina nas margens e que os blocos seguem as colunas.

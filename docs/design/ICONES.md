# Ícones · Meu Orçamento · v0.2

Status: **proposta para aprovação**.

## Conjunto
- **Material Icons, estilo preenchido (filled)**, grade de 24 × 24 px, sem traço.
- Os caminhos usados nos artefatos já são desse conjunto. A ficha anterior citava Material Symbols outlined; **esta versão corrige para Material Icons filled**, para evitar dois estilos.
- Tamanho: 24 px na navegação e nos botões; 20 px dentro de linhas de lista.
- Cor: sempre a cor do texto da área (`--md-text` ou `--md-text-muted`), nunca uma cor própria.

## Regras
- Ícone sem texto tem nome acessível (`aria-label`). Ícone com texto ao lado é decorativo (`aria-hidden`).
- Um ícone não representa dois conceitos. Cada ícone da lista abaixo tem um só significado.
- Não usar emoji como ícone.

## Catálogo
| Nome | Ícone Material | Uso |
|---|---|---|
| Resumo | dashboard | Aba Resumo |
| Orçamento | assignment | Aba Orçamento |
| Lançamentos | list | Aba Lançamentos |
| Ano | calendar_month | Aba Ano |
| Ajustes | settings | Aba Ajustes |
| Conta | person | Ajustes > Conta |
| Categorias | category | Ajustes > Categorias e itens |
| Cartões | credit_card | Ajustes > Cartões |
| Limites de alerta | notifications | Ajustes > Limites |
| Itens arquivados | archive | Ajustes > Itens arquivados |
| Importar planilha | table_chart | Ajustes > Importar planilha |
| Importar fatura | description | Ajustes > Importar fatura |
| Exportar | upload | Ajustes > Exportar |
| Simulador de competência | event_available | Ajustes > Simulador |
| Dados de exemplo | science | Ajustes > Dados de exemplo |
| Excluir conta | delete | Ajustes > Excluir conta |
| Editar | edit | Editar |
| Incluir | add | Incluir |
| Busca | search | Busca |
| Fechar | close | Fechar |
| Filtrar | filter_list | Filtrar |
| Sair | logout | Sair |
| Menu de ações | more_vert | Gatilho de menu |
| Expandir | expand_more | Expandir |
| Recolher | expand_less | Recolher |
| Subir | arrow_upward | Ordenar ou subir |
| Descer | arrow_downward | Ordenar ou descer |

## Pendências
- Ícone de Categorias agora é `category`. A linha "Categorias e itens" no canvas do app ainda usa o ícone de lista, igual ao de Lançamentos. Corrigir na revisão tela a tela.
- Os caminhos ficam no código como SVG inline. Quando houver biblioteca de código, o nome do ícone vira a referência.

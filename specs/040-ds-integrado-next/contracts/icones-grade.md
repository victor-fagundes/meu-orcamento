# Contract: Ícones e grade

## Grade

Depois de `npm run gen:css` no pacote, `packages/design-system/src/core/tokens.css` é idêntico a `buildCss()` e contém:

- `--bottom-bar-height: 76px`
- `--content-max-width: 960px`

Nenhuma outra medida é adicionada a `grid` nem ao CSS gerado. O `@font-face` com `url("../../fonts/...")` deixa de existir nesse arquivo.

## Ícones

Cada nome abaixo existe em `IconName`, tem caminho não vazio em `iconPaths` e uma linha em `docs/design/ICONES.md`. Conjunto: Material Icons preenchido, 24 px.

| Nome | Uso nesta história |
| --- | --- |
| `edit` | Editar |
| `add` | Incluir |
| `search` | Busca |
| `close` | Fechar |
| `filter_list` | Filtrar |
| `logout` | Sair |
| `more_vert` | Gatilho de `MenuAcoes` |
| `expand_more` | Expandir |
| `expand_less` | Recolher |
| `arrow_upward` | Ordenar ou subir |
| `arrow_downward` | Ordenar ou descer |

`delete` permanece. O teste falha se algum nome de `IconName` tiver caminho vazio. A lista acima, escrita como `satisfies readonly IconName[]`, falha a compilação se um nome não entrar no mapa.

## Captura

Para cada componente de [componentes.md](./componentes.md), quatro arquivos em `tests/visual/out/`:

`{componente}-light-390.png`, `{componente}-dark-390.png`, `{componente}-light-1280.png`, `{componente}-dark-1280.png`.

O teste não compara com imagem anterior e não cria `tests/visual/__snapshots__`. A pasta `tests/visual/out/` não é commitada.

## Fora deste contrato

Ícone outlined, emoji, ou nome que não está na spec. Medida 390 ou 1280 dentro de `tokens.ts`.

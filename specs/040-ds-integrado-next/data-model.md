# Data Model: DS integrado ao Next

Não há tabela, migration nem campo no banco. O que esta história acrescenta é preferência de tema no navegador, duas medidas e o contrato dos componentes.

## Preferência de tema

| Campo | Regra |
| --- | --- |
| Chave | `mo-tema` em `localStorage` |
| Valores | `light`, `dark`, `system` |
| Ausente ou outro texto | Trata como `system` |
| Atributo no `<html>` | `data-theme="light"` ou `data-theme="dark"`, já resolvido |
| Quem grava | O script do `<head>` só lê. `ThemeProvider.definirModo` lê e grava |

`system` segue `prefers-color-scheme`. Trocar o tema do aparelho com o modo em `system` atualiza `data-theme` sem gravar `light` ou `dark` por cima da chave.

## Grade

Objeto `grid` em `packages/design-system/src/core/tokens.ts`. Só entram as duas linhas novas.

| Campo | Valor | Variável CSS |
| --- | --- | --- |
| `bottomBarHeight` | 76 | `--bottom-bar-height` |
| `contentMaxWidth` | 960 | `--content-max-width` |
| `breakpointDesktop` | 720 | `--breakpoint-desktop` (já existe) |
| `sidebarWidth` | 240 | `--sidebar-width` (já existe) |
| `desktop.columns` / `margin` / `gutter` | 12 / 40 / 24 | já existem |
| `mobile.columns` / `margin` / `gutter` | 4 / 16 / 16 | já existem |

390 e 1280 são larguras de referência em `docs/design/GRID.md`. Não viram campo.

## Ícone

`iconPaths` continua a fonte. `IconName` é a chave. Cada caminho é uma string SVG não vazia, viewBox 24, Material Icons preenchido.

Nomes novos: `edit`, `add`, `search`, `close`, `filter_list`, `logout`, `more_vert`, `expand_more`, `expand_less`, `arrow_upward`, `arrow_downward`. `delete` permanece.

A linha em `docs/design/ICONES.md` repete o nome, o ícone Material e o uso. Um nome do tipo sem caminho não compila; caminho vazio falha o teste.

## Shell

| Campo | Regra |
| --- | --- |
| `abas` | A mesma lista de `NavegacaoPrincipal` |
| `ativa` | Id da aba. O shell não recalcula. Em subtela de Ajustes, quem chama passa Ajustes |
| `onNavegar` | Devolve o id |
| `cabecalho` | Nó do cabeçalho, sem título de produto inventado aqui |
| `children` | Conteúdo. Largura máxima 960 no desktop |

Abaixo de 720 px a navegação é a barra inferior, altura 76. A partir de 720 px é a barra lateral, largura 240. As duas usam `NavegacaoPrincipal`.

## Tabela

| Campo | Regra |
| --- | --- |
| `caption` | String obrigatória. Vira `<caption>` |
| `colunas` | `id`, `rotulo`, `tipo` (`texto` ou `numero`) |
| `linhas` | `id` e `celulas` (mapa coluna → string) |
| `selecionadaId` | Opcional. A linha correspondente leva `aria-selected="true"` |
| `onSelecionar` | Opcional. Sem ele, a linha não é botão de seleção |

Cabeçalho com `scope="col"`. Coluna `numero` alinha à direita e usa dígitos tabulares. A string da célula já chega formatada. A tabela não converte centavos e não soma.

## Campos e controle

| Componente | Estado | Nota |
| --- | --- | --- |
| `CampoBusca` | `valor: string` | `type="search"`. Botão limpar com nome acessível (padrão "Limpar"). `aria-controls` aponta o id do resultado |
| `CampoData` | `valor: string` (`AAAA-MM-DD` ou vazio) | `type="date"`, `lang="pt-BR"`, rótulo visível. Erro abaixo, ligado por `aria-describedby` |
| `Switch` | `marcado: boolean` | `role="switch"`, `aria-checked` |
| `BotaoIcone` | — | Só ícone. `rotulo` é obrigatório e vira `aria-label` |
| `Avatar` | `iniciais` (até duas) | Círculo em `--md-selected`. Com o nome ao lado, o círculo é `aria-hidden` e o nome é texto |

## Menu de ações

| Campo | Regra |
| --- | --- |
| `rotulo` | Nome acessível do botão ⋯ (`more_vert`) |
| `acoes` | `id`, `rotulo`, `destrutivo?`, `onEscolher` |
| Aberto | Lista no menu. Fecha com Esc e ao escolher |
| Destrutiva | Não aparece fora do menu. Escolher abre confirmação; o callback só corre no confirmar |

## Foco do painel

Vale para `Dialogo` e `FormularioContainer` quando `aberto` passa a verdadeiro.

1. Guarda o elemento ativo.
2. Foca o primeiro focoável do painel.
3. Tab no último volta ao primeiro. Shift+Tab no primeiro vai ao último.
4. Ao fechar, devolve o foco ao elemento guardado, se ainda existir.

Escape segue chamando `onCancelar`. Não há estado novo na props.

## Fora do modelo

Orçamento, lançamento, categoria, competência, parcela e qualquer coluna monetária. `ShellApp` não conhece rota. `Tabela` não conhece mês nem centavo.

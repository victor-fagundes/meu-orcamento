# Contract: Componentes novos e foco

Referência: [data-model.md](../data-model.md). Todos têm contrato em `src/base/contratos.ts`, implementação em `src/web/`, export em `src/web.ts` e teste em jsdom. Não há versão nativa.

## ShellApp

Cabeçalho, conteúdo e `NavegacaoPrincipal`.

| Largura | Navegação |
| --- | --- |
| Até 719 px | Barra inferior, altura `--bottom-bar-height` (76) |
| A partir de 720 px | Barra lateral, largura `--sidebar-width` (240) |

O conteúdo no desktop não passa de `--content-max-width` (960). `ativa` é o id recebido. Em subtela de Ajustes, Ajustes continua ativa porque quem chama passa esse id. O shell não olha a URL.

## Tabela

- `caption` obrigatória, visível para o leitor de tela.
- Cada `<th>` tem `scope="col"`.
- Coluna `numero`: alinhada à direita, `font-variant-numeric: tabular-nums`.
- Com `selecionadaId`, a linha correspondente tem `aria-selected="true"`.
- Sem `onSelecionar`, não há controle de seleção.

## CampoBusca

`<input type="search">`, rótulo visível, `aria-controls` no id informado. O botão de limpar tem nome acessível, esvazia o valor e não aparece como outro campo.

## CampoData

`<input type="date" lang="pt-BR">`, rótulo visível, valor `AAAA-MM-DD` ou vazio. Erro não vazio: mensagem abaixo do campo, `aria-invalid="true"`, `aria-describedby` apontando a mensagem. Sem erro, esses atributos saem.

A exibição DD/MM/AAAA é a do navegador com `lang="pt-BR"`. Não há segundo input mascarado.

## Switch

Botão com `role="switch"` e `aria-checked` igual ao estado. Ativar chama `onMudar` com o booleano oposto. Desabilitado não alterna.

## MenuAcoes

- O gatilho é um botão com o ícone `more_vert` e `aria-label` obrigatório.
- Aberto, as ações ficam num menu. Esc fecha e devolve o foco ao gatilho.
- Ação sem `destrutivo` chama `onEscolher` e fecha.
- Ação com `destrutivo` não é renderizada fora do menu. Escolhê-la pede confirmação. Cancelar não chama `onEscolher`. Confirmar chama.

## BotaoIcone

Só o ícone. `rotulo` é obrigatório no tipo e vira `aria-label`. Sem `rotulo`, não compila.

## Avatar

Círculo com iniciais, fundo `--md-selected`, texto `--md-on-selected`. Quando o nome está ao lado, o círculo tem `aria-hidden="true"` e o nome é o texto acessível. Sem o nome ao lado, o círculo tem nome acessível.

## Foco (Dialogo e FormularioContainer)

Com `aberto`:

- Tab e Shift+Tab não saem do painel.
- O primeiro e o último focoáveis se ligam em ciclo.
- Ao fechar, o foco volta ao elemento que estava ativo quando o painel abriu.

Os dois casos têm teste em jsdom. Escape continua cancelando.

## Fora deste contrato

Montar `ShellApp` nas rotas de Resumo, Orçamento, Lançamentos, Ano, Ajustes ou Entrada. Trocar `TabelaMeses`. Ação destrutiva solta na linha de uma tela de produto.

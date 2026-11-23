# Data Model: Shell da aplicação

A casca não cria tabela, coluna nem arquivo. Nada aqui é gravado no orçamento. O mês, quando uma história futura pedir, continua na query `mes` que as páginas já leem. A sessão continua a de hoje.

## Área

Cinco valores fixos, nesta ordem. Não há sexta.

| Campo | Regra |
|---|---|
| `id` | `resumo`, `orcamento`, `lancamentos`, `ano`, `ajustes` |
| `rotulo` | Resumo, Orçamento, Lançamentos, Ano, Ajustes |
| `endereco` | `/app/resumo`, `/app/orcamento`, `/app/lancamentos`, `/app/ano`, `/app/ajustes` |
| `icone` | `dashboard`, `assignment`, `list`, `calendar_month`, `settings` |
| `pedeMes` | `false` nas cinco. A história da tela é quem muda o dela. |

## Aba atual

Derivada do caminho, sem a query.

| Caminho | Aba |
|---|---|
| Começa com `/app/ajustes` | `ajustes` |
| Começa com o endereço de outra área | o `id` dessa área |
| Qualquer outro | nenhuma aba marcada |

Uma aba só. Encolher a janela não troca o caminho e, portanto, não troca a aba.

## Cabeçalho

| Campo | Regra |
|---|---|
| `titulo` | O `rotulo` da área atual. Se nenhuma aba casa, o cabeçalho não inventa título de uma sexta área. |
| `navegacaoMes` | Ausente enquanto `pedeMes` for falso. Quando for verdadeiro: rótulo do mês, “Mês anterior” e “Próximo mês”. O deslocamento é o que `shiftCompetencia` já faz. Esta história não liga `pedeMes`. |

## O que não é entidade

- Lançamento, item, categoria, plano e cartão não mudam de forma.
- “Sair” não é aba. É a ação que já encerra a sessão.
- O botão de criar não é dado da casca. Cada tela, na história dela, coloca o dela no topo do conteúdo.

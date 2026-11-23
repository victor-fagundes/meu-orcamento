# Contract: Resumo web

Contrato de tela. Não há rota HTTP nova. O endereço continua `/app/resumo`.

## Sessão e mês

| Situação | Resultado |
|---|---|
| Sem sessão | A casca não aparece. O redirect atual leva a `/login`. |
| Com sessão | Um bloco "Disponível neste mês", quatro cartões, filtros, sininho e gráfico, salvo o mês vazio. |
| `pedeMes` | Verdadeiro só em Resumo. O cabeçalho mostra "Mês anterior" e "Próximo mês". A página não repete esses controles. |
| Trocar o mês | Disponível, cartões, gráfico, média e alertas passam a ser os do mês destino. |

## Disponível

| Entrada | Tela |
|---|---|
| Planejado de despesas R$ 3.000,00 e gasto R$ 2.400,00 | R$ 600,00 |
| Planejado R$ 1.000,00 e gasto R$ 1.040,00 | −R$ 40,00, mesmo rótulo |
| Largura até 719 px | valor em `--type-display-md-size` |
| Largura a partir de 720 px | valor em `--type-display-lg-size` |
| Planejado maior que zero, pagamento em Todas, 80% no dia 17 de um mês de 30 dias que é hoje | "Usou 80% do planejado · Faltam 13 dias" e medidor em 80 |
| O mesmo 80% num mês que não é hoje | "Usou 80% do planejado", sem "Faltam" |
| Planejado de despesas zero | sem percentual e sem medidor |
| Percentual acima de 100 | a frase mostra o inteiro; a barra fica cheia |
| Pagamento diferente de Todas | disponível "—", sem percentual; no mês de hoje os dias restantes continuam |

Há um bloco só.

## Cartões

Ordem: Receitas, Fixas, Variáveis, Anuais. Duas colunas. A partir de 720 px a grade não passa de seis colunas do miolo.

| Entrada | Tela |
|---|---|
| Realizado R$ 8.200,99 e planejado R$ 1.200,50 | R$ 8.200 e "de R$ 1.200 planejados" |
| Pagamento diferente de Todas | realizado do meio; planejado "—" |
| Ativar Fixas | `/app/orcamento?mes=<mês>&tipo=F`. O mesmo para `R`, `V` e `E` |
| Valores ocultos | o toque continua e abre o mesmo endereço |

## Filtros

Chips de tipo: Todas, Receitas, Fixas, Variáveis, Anuais. Chips de pagamento: Todas, Débito, PIX, Dinheiro e cada cartão ativo pelo apelido. Categoria: Todas ou um grupo ativo. Cada um mostra a escolha.

| Ação | Resultado |
|---|---|
| Limpar filtros | `tipo`, `pagamento` e `categoria` somem; `mes` fica |
| Categoria escolhida | disponível, cartões, gráfico, detalhe e média usam só esse grupo; o sininho não muda |
| Tipo Fixas | o gráfico soma só Fixas; disponível e cartões ficam os do mês |
| Tipo Receitas | as semanas de gasto ficam em zero |
| Qualquer filtro | nenhum lançamento e nenhum plano é gravado |

## Ocultar

| Estado | Controle | Valores |
|---|---|---|
| À vista | nome "Ocultar valores", olho aberto, não pressionado | números do mês |
| Oculto | nome "Mostrar valores", olho cortado, `aria-pressed="true"` | disponível, cartões, gráfico, média e valor do detalhe mostram "R$ •••••" |

Percentual, dias e alertas continuam legíveis. Recarregar ou trocar o mês mantém a escolha neste navegador.

## Gráfico

| Mês | Semanas |
|---|---|
| 31 dias | cinco, Semana 1 a Semana 5 |
| 28 dias | quatro, sem Semana 5 |

Cada semana tem nome e valor em texto. "Ver detalhes da semana N" abre o painel com data, descrição e valor dos lançamentos de gasto daquela semana. Sem lançamento: "Nenhum lançamento nesta semana." Fechar devolve o foco ao controle.

Média, com gasto de despesas de R$ 100,00 no dia 10 do mês de hoje: R$ 10,00. Noutro mês de 30 dias, R$ 30,00 de gasto: R$ 1,00.

## Sininho

| Alertas | Tela |
|---|---|
| Um de atenção e um de estouro | quantidade 2, na ordem que o mês já calcula |
| Escolher um alerta | `/app/orcamento?mes=<mês>` |
| Nenhum | sem quantidade; painel "Nenhum alerta neste mês." |
| Abaixo do limite preventivo | não entra na quantidade |

Não há banner.

## Estados

| Situação | Tela |
|---|---|
| Sem receita planejada e sem lançamento | "Nenhuma receita neste mês", "Defina as receitas para acompanhar o disponível." e "Definir receitas". Sem bloco, sem cartões e sem gráfico. A ação abre o Orçamento do mês em Receitas |
| Mês com movimento e filtro sem linha | esse cartão não aparece |
| Carregando | nenhum R$ 0,00 |
| Falha | "Não foi possível carregar o mês." e "Tentar de novo", sem totais |

## Teclado, tema, movimento

Cada controle tem nome e foco visível. Pelo teclado a pessoa alcança os quatro cartões, os filtros, "Limpar filtros", ocultar, o sininho e "Ver detalhes". No mês vazio, alcança "Definir receitas". Claro e escuro permanecem legíveis. Com menos movimento, o painel abre sem animação. Em 390 px e em 1280 px não há intervalo de datas nem botão flutuante.

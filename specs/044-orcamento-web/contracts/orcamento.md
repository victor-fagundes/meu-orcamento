# Contract: Orçamento web

Contrato de tela. Não há rota HTTP nova. O endereço continua `/app/orcamento`.

## Sessão e mês

| Situação | Resultado |
|---|---|
| Sem sessão | A casca não aparece. O redirect atual leva a `/login`. |
| Com sessão | Quatro opções, uma marcada, o total do tipo e as categorias, salvo o tipo vazio. |
| `pedeMes` | Verdadeiro em Resumo e em Orçamento. O cabeçalho mostra "Mês anterior" e "Próximo mês". A página não repete esses controles. |
| Trocar o mês | Realizado, planejado, frases e banner passam a ser os do mês destino. O `tipo` e as `aberta` permanecem. |

## Tipo

Opções, nesta ordem: Receitas, Fixas, Variáveis, Anuais. Valores internos: `R`, `F`, `V`, `E`. Uma só marcada.

| Entrada | Tela |
|---|---|
| Sem `tipo`, ou `tipo` fora dos quatro | Fixas |
| `tipo=V` | Variáveis, lista só desse tipo |
| Realizado R$ 1.960,99 e planejado R$ 2.080,50, valores à vista | R$ 1.960 e "de R$ 2.080 planejados" |
| Trocar de tipo | destino sem `aberta` |
| Valores ocultos | "R$ •••••" e "de R$ ••••• planejados" |

## Categoria e item

A categoria começa fechada quando o nome não está em `aberta`. Fechada, mostra nome, cifras, medidor e frase, e não mostra item. Abrir uma não fecha outra. Fechar uma só fecha essa.

| Entrada | Frase |
|---|---|
| Limite 80, R$ 79,00 de R$ 100,00 | "Dentro do planejado" |
| Limite 80, R$ 80,00 de R$ 100,00 | "Perto do limite · 80%" |
| R$ 87,90 de R$ 100,00 | "Perto do limite · 87%" |
| Realizado igual ao planejado, planejado maior que zero | "No limite do planejado", medidor cheio |
| R$ 500,00 de R$ 200,00 | "Estourou em R$ 300,00", medidor cheio |
| Limite da categoria 50, realizado 50% | "Perto do limite · 50%" |
| Planejado zero | "Sem valor planejado", sem percentual |
| Valores ocultos | cifras "R$ •••••"; frase, medidor e banner com o texto |

Ordem: com valor no mês primeiro; zeradas depois; alfabética do português em cada bloco. Item arquivado e categoria arquivada não aparecem. Tocar o item abre o plano. Arquivar é outro controle.

Depois de gravar um item, a categoria dele entra em `aberta` e as outras `aberta` ficam. Categoria criada sem item entra fechada.

## Banner

Acima das opções. Some quando `alertasDoMes` volta vazio. A frase é a do alerta escolhido por `bannerFromAlertas`. Erro usa o banner de erro. Atenção usa o banner de atenção.

| Demais alertas | Linha |
|---|---|
| 0 | não há linha de contagem |
| 1 | "E mais 1 alerta." |
| 2 ou mais | "E mais N alertas." |

Despesas do mês estouradas vencem o estouro de uma categoria, porque o mês lista o total primeiro. Atenção do mês com estouro de categoria mostra o estouro. Trocar o tipo não troca o banner. Planejado zero e realizado maior que zero continuam "Sem valor planejado" na linha; o banner, quando esse é o primeiro erro, mostra "{categoria}: gasto sem orçamento planejado".

## Criar

"Nova categoria" e "Novo item" ficam no topo do conteúdo. Não flutuam. Os dois usam o tipo marcado.

| Caso | Resultado |
|---|---|
| Categoria "  Streaming  " | guardada como "Streaming", fechada |
| Nome vazio | "Informe o nome da categoria." |
| 41 caracteres | "Use no máximo 40 caracteres." |
| Quebra de linha | "Use o nome em uma linha só." |
| Nome ativo repetido no tipo | "Escolha outro nome. Já existe uma categoria com esse nome neste tipo." |
| Item "  Netflix  " em Streaming já aberta com Lazer aberta | nome "Netflix", Streaming e Lazer abertas, item visível |
| Item com categoria nova | item e categoria nascem juntos; falha não deixa metade |
| Nome de item vazio | "Informe o nome do item." |
| Nome de item com 81 caracteres | "Categoria ou nome muito longo." |
| Nome de item com 80 caracteres | aceito |
| Falha ao gravar | "Não foi possível salvar. Os campos continuam preenchidos." |
| Cancelar, toque fora, voltar | nada gravado; foco volta a quem abriu |

Não há renomear categoria nem arquivar categoria nesta página.

## Plano

Painel com o nome do item. A partir de 720 px, 460 px. Abaixo disso, a largura do conteúdo. O campo mostra o valor do mês aberto, também com a lista oculta. O interruptor "Aplicar também aos próximos meses" começa desligado.

| Ação | Resultado |
|---|---|
| Salvar, interruptor desligado | só o mês aberto muda; o painel fecha; o foco volta ao item |
| Salvar em novembro com o interruptor ligado e R$ 400,00 | novembro e dezembro ficam em R$ 400,00; janeiro a outubro ficam |
| Salvar em dezembro com o interruptor ligado | só dezembro muda; o painel fecha |
| Cancelar, toque fora, voltar | os doze valores ficam; o foco volta ao item |
| Copiar mês anterior, de outubro R$ 300,00 para novembro | novembro fica em R$ 300,00; o painel continua aberto |
| Copiar mês anterior em janeiro | "Janeiro não tem mês anterior neste ano."; nada muda; painel aberto |
| Aplicar a todos os meses com R$ 650,00 | os doze ficam em R$ 650,00; painel aberto |
| Copiar ano anterior | "Não há plano do ano anterior para copiar."; nada muda; painel aberto |
| Vazio | "Informe o valor do plano."; painel aberto |
| Negativo | "Informe um valor maior ou igual a zero."; painel aberto |
| Terceira casa decimal | "Use no máximo duas casas decimais."; painel aberto |
| Zero | o mês aberto fica em R$ 0,00; o painel fecha |
| Falha | "Não foi possível salvar. Os campos continuam preenchidos."; painel aberto |

## Arquivar

| Ação | Resultado |
|---|---|
| Abrir | título "Arquivar {nome}?" e a frase "Ele sai do Orçamento e de novos lançamentos. Os lançamentos antigos continuam." |
| Confirmar | o item sai do Orçamento e dos novos lançamentos; o lançamento antigo permanece |
| Cancelar, toque fora, voltar, Esc | o item permanece; o foco volta ao controle |

Não há desarquivar nem reordenar.

## Gerenciar, vazio, carregando e erro

| Situação | Resultado |
|---|---|
| Gerenciar em Fixas | `/app/ajustes/categorias?tipo=F`, lista das categorias ativas desse tipo |
| Tipo sem item ativo | "Nenhum item neste tipo", "Crie um item para planejar o mês." e "Novo item"; os botões do topo continuam |
| Carregando | sem R$ 0,00 no lugar dos números |
| Falha | "Não foi possível carregar o mês." e "Tentar de novo"; sem totais |

## Teclado e aparência

Cada controle tem nome. O foco é visível. Opções, Gerenciar, Nova categoria, Novo item, cabeçalhos, itens e Arquivar são alcançáveis pelo teclado. No painel e no diálogo o foco permanece até fechar. Claro e escuro permanecem legíveis. Com menos movimento, painel e diálogo aparecem sem animação. Em 390 px e em 1280 px não há intervalo de datas nem botão flutuante.

Categoria, item e plano de outra conta são tratados como inexistentes.

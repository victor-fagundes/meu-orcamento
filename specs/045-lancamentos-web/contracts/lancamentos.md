# Contract: Lançamentos web

Contrato de tela. Não há rota HTTP nova. O endereço continua `/app/lancamentos`.

## Sessão e mês

| Situação | Resultado |
|---|---|
| Sem sessão | A casca não aparece. O redirect atual leva a `/login`. |
| Com sessão e linhas | Tabela da competência, busca e filtros. |
| `pedeMes` | Verdadeiro em Resumo, Orçamento e Lançamentos. O cabeçalho mostra "Mês anterior" e "Próximo mês". A página não repete esses controles. |
| Trocar o mês | A competência, as linhas e o selo passam a ser os do mês destino. `q`, `item` e `pagamento` permanecem. |

## Tabela

Legenda "Lançamentos de {mês}". Colunas: Data, Descrição, Item, Pagamento, Valor. Valor à direita, com centavos quando os valores estão à vista.

| Entrada | Tela |
|---|---|
| Cartão, fechamento 25, compra 26/05/2026 | junho, data 26/05/2026, selo "Fatura 06/2026" |
| Débito na mesma data | maio, sem selo |
| Parcela 2 de 6 | "Parcela 2 de 6 · restam 4" |
| À vista | sem texto de parcela |
| Cartão com apelido | o apelido na coluna Pagamento |
| Cartão sem apelido | "Crédito" |
| Mesma data | o `createdAt` mais novo primeiro |
| Valores ocultos | "R$ •••••" na coluna Valor. O resto permanece |
| Linha | nome "Editar {descrição}". Não há "Excluir" |

## Busca e filtros

| Entrada | Tela |
|---|---|
| "uber" | encontra "Uber" na descrição ou no item. Não encontra "açúcar" por "acucar" |
| "uber99" sem linha | `Nenhum resultado para "uber99"`, a frase de conferir a descrição, "Limpar busca" |
| Limpar busca | `q` some. O mês e os filtros ficam |
| Item e Crédito juntos | só a interseção |
| Filtro sem texto e sem linha | "Nenhum lançamento com esses filtros." |
| Mês destino vazio com `q` | o resultado da busca. Limpar mostra o cartão de vazio |

## Registrar

Painel "Registrar lançamento". Cancelar, toque fora, voltar e Esc fecham sem gravar e devolvem o foco a "Registrar".

| Entrada | Resultado |
|---|---|
| Item Supermercado, descrição vazia, R$ 186,40, 12/11/2026, débito | linha em novembro, descrição Supermercado, "Lançamento salvo." por 5 segundos, sem desfazer |
| Valor vazio, zero ou negativo | nada gravado, "Informe um valor maior que zero." |
| Sem item | "Selecione o item." |
| Data vazia | "Data inválida." |
| Pix | sem cartão e sem "Parcelar". Competência = mês da data |
| Crédito sem cartão ativo | "Nenhum cartão ativo." e, ao salvar, "Selecione o cartão." |
| R$ 100,00, 26/05/2026, fechamento 25, 3× | prévia R$ 33,34, R$ 33,33 e R$ 33,33 em junho, julho e agosto. As três linhas guardam a data 26/05/2026 |
| Quantidade 0 ou 61 | "Parcelas devem ser entre 1 e 60." |
| Gravação incompleta do grupo | nenhuma parcela fica |
| Cartão sem fechamento | competência = mês da compra, sem selo, aviso "Sem dia de fechamento, a competência é o mês da compra." |
| Falha ao salvar | painel aberto, campos preenchidos, "Não foi possível salvar. Os campos continuam preenchidos." |

## Editar

Painel "Editar lançamento". O valor é o da parcela. Não há quantidade de parcelas.

| Entrada | Resultado |
|---|---|
| À vista, descrição nova, mesmo mês | só essa linha muda. O painel fecha. O foco volta à linha. "Lançamento salvo." por 5 segundos |
| À vista, data de novembro para dezembro | a linha sai de novembro. O foco vai para "Registrar" |
| Grupo, antes da escolha | "Corrigir parcelamento", "Só esta parcela" e "Esta e as próximas". Salvar do diálogo não grava. Não há "Todas do parcelamento" |
| 3ª de 6, R$ 40,00, só esta | as outras cinco iguais |
| 3ª de 6, esta e as próximas | a 3ª, a 4ª, a 5ª e a 6ª mudam. A 1ª e a 2ª ficam. O texto continua "Parcela N de 6" |
| Data 31/01/2026, esta e as próximas | a seguinte fica em 28/02/2026, ou 29/02/2026 no bissexto |
| Cancelar o diálogo | nada muda. O painel continua com o que foi digitado |
| Falha ao salvar | painel aberto |

## Excluir

| Entrada | Resultado |
|---|---|
| À vista | "Excluir lançamento?", "1 lançamento sai da lista.", "Você pode desfazer por 10 segundos." |
| 3ª de 6, esta e as próximas | "4 lançamentos saem da lista." Saem a 3ª até a 6ª. A 1ª e a 2ª continuam "Parcela 1 de 6" e "Parcela 2 de 6" |
| Todas do parcelamento | sai o grupo, também em outros meses |
| Confirmar | painel fecha, foco em "Registrar", snackbar com "Desfazer" |
| Desfazer em até 10 segundos | as mesmas linhas voltam, sem cópia e sem reabrir o painel |
| 10 segundos | o aviso some e não há outro desfazer |
| Recarregar com o aviso aberto | as linhas continuam fora |
| Cancelar | nenhuma linha sai |
| Falha | a linha continua, o painel continua, o foco volta a "Excluir lançamento" |

Enquanto o desfazer está visível, "Lançamento salvo." não o cobre. Uma segunda exclusão substitui o desfazer anterior.

## Vazio, espera e erro

| Situação | Tela |
|---|---|
| Novembro sem lançamento e sem busca | "Nenhum lançamento em novembro", a frase de registrar gasto ou receita, "Registrar lançamento". Sem busca e sem filtros |
| Carregando | `Skeleton`. Não aparece R$ 0,00 nem o cartão de vazio |
| Falha ao carregar | "Não foi possível carregar o mês." e "Tentar de novo". Sem tabela |

## Foco, largura e tema

A linha, "Registrar", a busca, os filtros, o painel e os diálogos são alcançáveis pelo teclado. O foco fica no painel ou no diálogo até fechar. A partir de 720 px o painel mede 460 px, a largura que o pacote já define. Abaixo disso, usa a largura do conteúdo. Em 390 px e em 1280 px não há botão flutuante nem intervalo de datas. Claro e escuro permanecem legíveis. Com menos movimento, painel e diálogo aparecem sem transição.

Lançamento de outra conta não aparece e as actions não o alteram.

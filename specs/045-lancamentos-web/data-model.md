# Data Model: Lançamentos web

Não há tabela nova, coluna nova nem migração. Busca, item e pagamento continuam na query. O lançamento continua na tabela que já existe, filtrado pelo `orcamentoId` da sessão. O desfazer de 10 segundos não é linha de banco.

## Lançamento

O que a página lê para a competência aberta.

| Dado | Regra |
|---|---|
| Identidade | id, data da compra, competência, centavos, descrição, meio |
| Item | id, nome, categoria, tipo. A linha permanece se o item for arquivado |
| Cartão | id, apelido, dia de fechamento. Nulo fora do crédito |
| Parcela | número, total e id do grupo. Nulos no à vista |
| Ordem | data da compra decrescente; na mesma data, `createdAt` decrescente |

A lista é a competência, não o mês da data. A data mostrada é a data da compra.

## Parcelas irmãs

Não são outra entidade. São as linhas do mesmo `grupoParcelaId` que caem em outros meses. A página as lê junto com o mês, só para os grupos que têm ao menos uma linha na competência aberta. Servem para a quantidade do alcance. Não entram na tabela desse mês.

## Query

Não é gravada.

| Chave | Ausente ou inválida | Preenchida |
|---|---|---|
| `mes` | competência de hoje | `AAAA-MM` válido |
| `q` | sem busca | texto, já sem espaços das pontas na comparação |
| `item` | todos os itens | id de um item que tem linha no mês |
| `pagamento` | todos | `deb`, `pix`, `din` ou `cartao` |

Trocar o mês conserva `q`, `item` e `pagamento`. "Limpar busca" apaga só `q`.

## Filtro

Derivado das linhas do mês. Não grava.

| Controle | Efeito |
|---|---|
| Busca | descrição ou nome do item, minúsculas, com acento |
| Item | uma linha daquele item, inclusive arquivado se ele tem linha no mês |
| Pagamento | `cartao` reúne todos os cartões. Os outros três são o meio |

Os três valem juntos. Mês sem linha e sem `q` não mostra busca nem filtros.

## Prévia

Derivada, antes de gravar. Não é tabela.

| Campo | Conta |
|---|---|
| Quantidade | 1 fora do crédito. No crédito, 1 com o interruptor desligado; 2 ao ligar; 1 a 60 se a pessoa editar |
| Valores | os centavos de `buildLancamentoDraft`. R$ 100,00 em 3× é 3334, 3333 e 3333 |
| Competências | as do draft. A data da compra é a mesma nas três linhas criadas |
| Selo | "Fatura MM/AAAA" só com dia de fechamento de 1 a 28 |

## Correção

O valor informado é o centavo de cada parcela do alcance. O total original não é redistribuído. A quantidade do grupo não muda.

| Alcance | Linhas |
|---|---|
| À vista | só a aberta. Não há diálogo |
| Só esta parcela | só a aberta |
| Esta e as próximas | da aberta até a última. A data avança um mês; a competência é recalculada |

Não há alcance que altere as parcelas anteriores.

## Exclusão

Imediata. O diálogo de grupo usa a mesma contagem do domínio.

| Alcance | Sai |
|---|---|
| À vista | a linha aberta |
| Só esta parcela | a linha aberta. As outras não são renumeradas |
| Esta e as próximas | da aberta até a última |
| Todas do parcelamento | o grupo, inclusive em outros meses |

O estado de desfazer guarda o `removed` da action por 10 segundos na tela. Desfazer reinsere esses ids. Recarregar apaga o estado e não reinsere.

## Seletor

| Lista | Quem entra |
|---|---|
| Item no registro | ativos, agrupados por Receitas, Fixas, Variáveis e Anuais |
| Item na edição | os ativos, mais o item desta linha se estiver arquivado |
| Cartão no registro | ativos |
| Cartão na edição | os ativos, mais o cartão desta linha se estiver inativo |

## Preferência de ocultar

A chave que o Resumo já usa: `mo-ocultar-valores`. `"1"` troca a coluna Valor por "R$ •••••". Qualquer outra leitura mostra `formatarBRL`. Não há coluna nova e não há segunda chave. O painel aberto lê o centavo real mesmo com a chave ligada.

## O que não é entidade

- Campo de observação separado da descrição.
- Forma Transferência.
- Alcance "Todas" na correção.
- Competência escolhida na mão.
- Botão flutuante e intervalo de datas.
- Desfazer depois de 10 segundos ou depois de recarregar.

# Contract: Correção na abertura, lista e seletor

## Correção

Dispara em toda abertura autenticada de `/app`, antes do conteúdo, só no `orcamentoId` da sessão.

Quando existe item ativo do catálogo e item ativo de mesmo nome num grupo Receitas, Despesas Fixas, Despesas Variáveis ou Anuais:

- Copia para o catálogo, mês a mês, o maior centavo positivo dos extras se o mês do catálogo está em zero.
- Não substitui mês do catálogo que já é positivo.
- Arquiva cada extra.
- Não altera `lancamentos.itemId`.

Se não houver par, a abertura não escreve. A abertura seguinte, com o extra já arquivado, também não escreve.

O item arquivado aparece na lista de Ajustes e some da lista ativa do Orçamento e do seletor de Novo lançamento.

## Lista do Orçamento

Na aba do tipo, grupos com plano ou gasto no mês aberto aparecem antes dos grupos em que os dois são zero. A ordem dentro de cada bloco é pt-BR. O grupo zerado continua expansível e o botão “Novo item” continua visível.

## Seletor

Entre itens ativos de mesmo nome, o valor inicial é:

1. o que tem plano maior que zero no mês da competência aberta;
2. senão, o que tem algum mês do ano maior que zero;
3. senão, o primeiro da lista de hoje.

Arquivados não aparecem.

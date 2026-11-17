# Contract: Alvo da linha de planejamento

Quem confirma uma planilha de planejamento vê, antes de gravar, o grupo em que cada linha vai cair. O servidor recalcula esse alvo a partir das linhas e dos itens do orçamento da sessão. O browser não escolhe o item gravado sozinho.

## Entrada

- Linhas da aba, como a 015/020 já mandam.
- Itens ativos do `orcamentoId` da sessão: `id`, `tipo`, `grupo`, `nome`.
- Opcional: escolhas `{ n, grupo }` só para linhas cujo alvo voltou `escolher`. `grupo` tem de ser um dos grupos do catálogo que já empataram naquele nome.

## Saída de cada linha ok

| Alvo | O que a prévia mostra | O que a confirmação grava |
|---|---|---|
| `catalogo` | Grupo e tipo do único item de mesmo nome | Atualiza o plano desse item. Não cria outro. |
| `outros` | Grupo Outros e o tipo da seção | Cria o item ali, se a opção de criar itens estiver ligada. Não cria grupo Receitas, Despesas Fixas, Despesas Variáveis nem Anuais. |
| `escolher` | Os grupos candidatos | Sem escolha válida, a linha é rejeitada e o plano dela não muda. |

## Exemplos que o teste de domínio precisa travar

1. Seção “Despesas Fixas” + linha Aluguel, e já existe F|Moradia|Aluguel → alvo `catalogo`, grupo Moradia. Não existe segundo Aluguel depois do confirm.
2. Seção “Despesas Fixas” + linha Luz, e a única Luz é V|Habitação|Luz → alvo `catalogo`, tipo V, grupo Habitação.
3. Linha Streaming sem nome igual no catálogo → alvo `outros`, tipo da seção.
4. Nome igual a dois itens do catálogo, sem escolha → a linha não grava.
5. Cancelar não chama a gravação.
6. Mês vazio ou zero na planilha não apaga plano já gravado. Mês positivo substitui. Mês negativo ou ilegível zera aquele mês.

## Confirmação

`importVfPlano` resolve o alvo no domínio antes de procurar o item por tipo + grupo + nome. A busca deixa de usar o grupo cru da seção.

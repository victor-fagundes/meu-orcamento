# Glossário e microcopy · Meu Orçamento · v0.1

## Glossário (use exatamente estes termos)
| Termo | Significa | Não use |
|---|---|---|
| Item | Uma conta ou gasto planejado, como Aluguel | Conta, linha |
| Categoria | Agrupamento de itens dentro de um tipo, como Moradia | Grupo (só no código) |
| Tipo | Receitas, Despesas fixas, Despesas variáveis ou Anuais | Natureza |
| Lançamento | Um gasto ou receita registrado numa data | Transação, movimento |
| Plano | Valor previsto de um item no mês | Orçamento do item |
| Realizado | Soma dos lançamentos do mês | Gasto real |
| Disponível neste mês | Planejado de despesas menos gasto de despesas | Saldo, ainda pode gastar |
| Sobra no ano | Receitas menos despesas no ano | Saldo final |
| Competência | Mês de fatura em que uma compra cai | Mês da compra |
| Arquivar | Tira do Orçamento e de novos lançamentos; o histórico continua | Excluir |
| Excluir | Remove o registro | Arquivar |

## Padrões de texto
- **Botões:** verbo + objeto, em 1 a 3 palavras. "Salvar plano", "Excluir lançamento", "Criar categoria".
- **Cancelar** é sempre o botão da esquerda, secundário.
- **Confirmação destrutiva:** pergunta com o nome do objeto, e a frase explica a consequência. "Arquivar Lazer? Os itens saem do Orçamento. Os lançamentos antigos continuam."
- **Erro:** diz o que aconteceu e o que fazer. "Informe um valor maior que zero." Não use "Erro" sozinho nem culpe o usuário.
- **Sucesso:** curto e no passado. "Lançamento salvo.", "Categoria arquivada."
- **Vazio:** título + explicação + ação. "Nenhum lançamento neste mês. Registre cada gasto para acompanhar o que já foi usado."
- **Falha de conexão:** "Não foi possível salvar. Os campos continuam preenchidos."

## Números, datas e moeda (pt-BR)
- Moeda: R$ 1.234,56. Em valores grandes sem centavos: R$ 1.234. Negativo: −R$ 40,00.
- Datas: 15/11/2026. Mês: novembro de 2026. Mês curto em colunas: nov.
- Percentual: 87%, sem casa decimal.
- Dígitos tabulares em todos os valores de tabela.

## Tom
- Direto, sem jargão, sem exclamação em erro. Tratar o usuário por "você".
- Não dar conselho financeiro no texto da interface. Descrever o estado ("Perto do limite · 81%").

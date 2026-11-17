# Data model: Revisão pontual do computador

Nada é persistido.

## Recorte do Resumo

| Campo | Regra |
|-------|--------|
| Saldo do mês | Orçado de despesas menos gasto de despesas, lista inteira. Pode ser negativo. |
| Gasto do recorte | Soma dos lançamentos de despesa que passam no pagamento e na categoria. |
| Frase | Com filtro aberto, cita o gasto do recorte e o saldo do mês. Sem filtro, a frase atual permanece. |

## Grupo no Orçamento

| Campo | Regra |
|-------|--------|
| Com movimento | Plano ou realizado do mês maior que zero. Fica na lista principal. |
| Sem movimento | Os dois zerados. Fica sob o controle "Sem movimento neste mês". |
| Ainda cabe no tipo | Plano do tipo menos realizado do tipo. |

## Tipo conservado

O tipo selecionado viaja no endereço junto do mês. Valores: receitas, fixas, variáveis, anuais.

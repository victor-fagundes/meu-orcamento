# Contract: Resumo no Android

`GET /api/v1/resumo?competencia=YYYY-MM` permanece. O aparelho exige o objeto `totais`.

| Elemento | Conteúdo |
|----------|----------|
| Título | Nome do mês, vindo da casca 030 |
| Primeiro valor | Ainda pode gastar, ou passou do orçado se negativo |
| Frase | Parcela gasta. Dias restantes só no mês corrente |
| Quatro linhas | Nome, realizado e planejado |
| Toque | Abre Orçamento com aquele tipo |

Sem filtro de pagamento e sem filtro de categoria.

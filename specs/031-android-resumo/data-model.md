# Data model: Resumo no Android

Leitura de `totais` já definido na spec 028. A tela não cria entidade.

| Campo na tela | Origem |
|---------------|--------|
| Ainda pode gastar | `totais.aindaPodeGastarCentavos` |
| Linha de tipo | `totais.porTipo` na ordem recebida |
| Dias restantes | Calendário civil, só se a competência é o mês de hoje |
| Erro | `totais` ausente. Nenhum número de despesa é mostrado. |

Receita não altera ainda pode gastar. Essa regra já está no servidor.

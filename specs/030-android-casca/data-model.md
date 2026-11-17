# Data model: Casca nativa do Android

Estado só de memória, no `AppNav`.

| Campo | Regra |
|-------|--------|
| Destino | resumo, orcamento, lancamentos, ano ou ajustes. Importar e exportar não trocam o destino marcado: Ajustes segue selecionado. |
| Competência | `YYYY-MM`. Uma para Resumo, Orçamento e Lançamentos. Mês anterior e próximo só ajustam esse texto. |
| Tipo | `R`, `F`, `V` ou `E`. Omissão `F`. Não muda quando a competência muda. |
| Ano | Inteiro separado, usado só pela tela Ano. |

Não há tabela nem arquivo de orçamento no aparelho.

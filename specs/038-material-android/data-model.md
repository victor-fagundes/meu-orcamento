# Data model: Aparência Material no Android

Nada é gravado. Os campos abaixo são estado de tela ou token visual.

| Campo | Regra |
|-------|--------|
| Tema | Claro ou escuro, lido do aparelho na pintura. Não há valor salvo em Ajustes. |
| Marca | Amarelo do produto com a inicial M. Não colore barra, chip, pílula nem aviso. |
| Destino | Os cinco de hoje. Importar e exportar não mudam o destino marcado. |
| Título da barra | Mês civil e ano nas telas de mês. Ano confirmado na tela Ano. "Ajustes" em Ajustes. Nome da tarefa em importar e exportar. |
| Valor principal | Centavos já calculados, só na formatação em reais. Negativo usa cor de erro. |
| Linha | Nome, valor à direita, detalhe secundário. O valor permanece na mesma faixa se o nome for longo. |
| Barra de consumo | Azul dentro do plano. Aviso a partir de 80%, inclusive 100%. Erro só acima de 100%. Altura de 4 dp. |
| Entrada | E-mail, senha e, no cadastro, nome. Um botão preenchido. A ação de troca de modo é texto. |

Competência, tipo, totais, itens e lançamentos continuam os modelos das specs 030–036. Esta história não acrescenta campo na API nem no aparelho.

# Data Model: Acabamento do Android

Não há tabela nova. O que muda é o que a tela mostra e três respostas de API sobre dados que já existem.

## Marca

| Campo | Valor |
| --- | --- |
| Fundo | `#FFE600` |
| Letra | `M`, `#221B00` |
| Onde aparece | Gaveta (redonda, quadrada, uma cor), splash, entrada |
| Fora | Medidor, aviso, controle de tipo, destino ativo |

## Número principal

O maior texto da tela, Manrope extra-negrito, à esquerda. Usado em "Ainda pode gastar", "Passou do orçado" e "Ainda cabe". Negativo usa a cor de erro. O valor é o da conta, em centavos já calculados, só formatado na borda.

## Linha

| Parte | Regra |
| --- | --- |
| Nome | Cede espaço |
| Detalhe | Opcional, por baixo |
| Valor | À direita, na mesma linha, sempre visível |
| Altura | Estável entre Resumo, Orçamento, Lançamentos, Ano e Ajustes |

## Medidor

| Condição | Cor |
| --- | --- |
| Dentro do plano, abaixo de 80% | Azul `#0058BE` |
| De 80% até 100%, inclusive "chegou" | Aviso |
| Acima de 100% | Erro |
| Plano zero | Aviso, sem inventar porcentagem |

A trilha permanece visível.

## Menu de Ajustes

Ordem fixa. Cada item tem ícone, título e subtítulo. O ícone é azul, exceto Excluir conta.

| Ordem | Título | Ícone | Abre |
| --- | --- | --- | --- |
| 0 | E-mail da conta | Pessoa | Esqueci a senha e Sair, na própria linha |
| 1 | Cartões | Cartão | Fluxo atual de cartão |
| 2 | Limites de alerta | Sino | Fluxo atual de limite |
| 3 | Importar planilha | Folha | Fluxo atual |
| 4 | Importar fatura | PDF | Fluxo atual |
| 5 | Exportar | Seta para baixo | Fluxo atual |
| 6 | Simulador de competência | Calendário | Prévia, sem gravar |
| 7 | Itens arquivados | Caixa | Lista, sem desarquivar nesta história |
| 8 | Dados de exemplo | Frasco | Confirma e grava planos de exemplo |
| 9 | Excluir conta | Lixeira vermelha | Frase EXCLUIR e apaga a conta |

## Simulação

Pedido: data `AAAA-MM-DD`, parcelas de 1 a 60, dia de fechamento 1–28 ou ausente.

Resposta: primeira competência `AAAA-MM` ou vazia, e a lista de competências das parcelas. Nada é gravado. A regra é a do domínio: no dia do fechamento ou depois, a primeira competência é o mês seguinte.

## Arquivado

Linha somente leitura: tipo, grupo, nome. Vem de itens com arquivado marcado. Não entra em lançamento novo nem na lista ativa do Orçamento.

## Exemplo

Confirmação em dois toques. A gravação atualiza planos de itens já existentes, em centavos, e devolve a quantidade atualizada. Não cria lançamento.

## Exclusão de conta

Dois passos: a pessoa pede para excluir e depois digita `EXCLUIR`. A frase errada não apaga. A frase certa remove a conta e encerra a sessão neste aparelho.

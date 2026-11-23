# Módulos · Meu Orçamento · v0.2

Módulo é uma combinação de componentes que se repete em mais de uma tela. Usar o módulo pronto evita que cada tela reinvente o mesmo bloco.

Status: **proposta para aprovação**.

| # | Módulo | Composição | Onde aparece | Regra |
|---|---|---|---|---|
| 1 | **Cabeçalho de tela** | Botão de voltar ou setas de mês, título, ação à direita | Todas as telas com barra | Altura 56 px. Título em `title-md`, centralizado no celular. |
| 2 | **Bloco de saldo** | Rótulo (`label`), valor (`display`), frase de apoio, medidor | Resumo, Resumo vazio, Resumo filtrado | O valor é sempre o principal da tela. Só um bloco de saldo por tela. |
| 3 | **Grade de totais** | 4 cartões: rótulo, valor (`title-lg`), "de R$ x planejados" | Resumo (celular e web) | Celular: 2 colunas. Web: 2 colunas dentro de 6 colunas do grid. |
| 4 | **Grupo com medidor** | Cabeçalho com nome e total, medidor, frase de estado, lista de itens recolhível | Orçamento | Tocar no cabeçalho abre ou fecha. A frase de estado é obrigatória. |
| 5 | **Linha de item** | Nome, valor realizado / planejado, frase de estado | Dentro do grupo; lista de categorias | Altura mínima 48 px. Toque abre a edição. |
| 6 | **Linha de lançamento** | Descrição, valor, data · item · pagamento | Lançamentos (celular e web) | Toque abre a edição. Excluir não fica na linha. |
| 7 | **Seletor de tipo** | 4 opções em segmento: Receitas, Fixas, Variáveis, Anuais | Orçamento | Exatamente uma opção ativa. Não é aba de navegação. |
| 8 | **Formulário** | Rótulo, campo, mensagem de erro, rodapé | Sheet, painel lateral, criar conta, cartão, limites | Um campo por linha no celular. Erro abaixo do campo. |
| 9 | **Rodapé de ações** | Cancelar à esquerda, ação principal à direita | Sheets, painéis, diálogos | Uma ação principal. Destrutiva em `--md-error`. |
| 10 | **Cabeçalho de sheet** | Puxador, título (`title-md`), subtítulo opcional | Sheets do celular | Sempre presente em sheet. |
| 11 | **Cartão de vazio** | Título, uma frase, uma ação | Resumo, Orçamento, Lançamentos, Ano, Cartões | Sem ilustração. A ação fica no FAB (celular) ou no cartão (web). |
| 12 | **Banner de estado** | Texto curto; tipo info, atenção ou erro | Topo da área de conteúdo | Erro usa alerta. Atenção e info usam status. |
| 13 | **Linha de ajuste** | Ícone, rótulo, valor ou apoio, chevron | Ajustes (celular) | Ícone de 20 px. Grupos com rótulo em `caption`. |
| 14 | **Tabela de meses** | Linhas por categoria, colunas por mês, total | Ano (web) | Mês ativo destacado. Números alinhados à direita. |
| 15 | **Barra de navegação** | 5 abas: celular na base, web como lateral | Todas as telas principais | Aba ativa com pílula. Subseções não trocam a aba ativa. |
| 16 | **Snackbar** | Texto e, quando houver, ação "Desfazer" | Base da tela, após ação | Uma por vez. Com desfazer, 10 s; sem, 5 s. |

## Como usar
- Ao criar tela, procurar primeiro o módulo que resolve o bloco. Só criar um novo se nenhum servir.
- Se um módulo precisar de variação nova, a mudança entra na lista acima com a regra. Não fica só numa tela.
- Módulo não substitui componente: ele é montado com componentes da ficha `COMPONENTES.md`.

## Pendências
- Módulos 11 e 12 aparecem com textos diferentes entre celular e web. Padronizar o texto com o `MICROCOPY.md`.
- Módulo 14 existe só no web; avaliar uma versão compacta para celular quando a tela Ano for revisada.

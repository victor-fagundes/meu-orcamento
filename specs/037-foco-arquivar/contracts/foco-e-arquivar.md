# Contract: Foco, Arquivar e região principal no computador

Contrato de interação. Não há endpoint novo.

## Diálogos

| Diálogo | Alvo do foco ao abrir | Seleção de texto |
|---------|------------------------|------------------|
| Plano do item | Campo do mês da competência aberta no Orçamento | Nenhuma |
| Novo item | Nome do item | Nenhuma |
| Novo lançamento | Valor | Nenhuma |
| Editar lançamento | Valor | Nenhuma |
| Alertas do mês | Fechar | Nenhuma |

Enquanto aberto, Tab e Shift+Tab circulam só dentro do diálogo. Escape, clique no fundo e Cancelar fecham sem gravar e devolvem o foco ao controle que abriu.

Competência que não seja `YYYY-MM` com mês de 01 a 12: o alvo do plano é o campo de janeiro.

## Arquivar

| Passo | Quem vê | Quem ouve |
|-------|---------|-----------|
| Primeiro | Arquivar | Arquivar e o nome do item |
| Segundo, o que grava | Arquivar, o nome e a interrogação | A mesma frase |
| Gravando | Reticências | Arquivando e o nome do item |

Só o segundo passo chama a ação de arquivar já existente. No máximo um item armado na lista. Confirmar remove o item da lista ativa e conserva os lançamentos.

## Salto

O primeiro controle do chrome do app diz "Ir para o conteúdo" e move o foco para a região principal da tela atual. Resumo, Orçamento, Lançamentos, Ano e Ajustes expõem esse destino. Login, cadastro e a página inicial não mudam.

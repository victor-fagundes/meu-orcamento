# Data model: Foco do diálogo e Arquivar no computador

Nada disso é persistido. São estados de tela.

## Diálogo

| Campo | Regra |
|-------|--------|
| Aberto | Sim ou não. Fechado não guarda foco. |
| Alvo | Um controle: valor do mês aberto, nome do item, valor do lançamento, Fechar, ou o próprio diálogo se não houver alvo. |
| Foco anterior | O controle que abriu. Restaurado ao fechar. |
| Texto selecionado | Permanece não selecionado depois que o foco entra. |

Transição: fechado → aberto move o foco para o alvo. Aberto → fechado (Escape, fundo ou Cancelar) devolve o foco anterior e não grava.

O mês aberto é um inteiro de 0 a 11, derivado da competência já exibida. Fora dessa faixa, o alvo é o primeiro mês.

## Controle de arquivar

| Estado | Texto visível | Nome anunciado | Grava? |
|--------|----------------|----------------|--------|
| Repouso | Arquivar | Arquivar {nome} | Não |
| Armado | Arquivar {nome}? | Arquivar {nome}? | Não |
| Gravando | … | Arquivando {nome} | A ação já disparou. Novo toque é ignorado. |

Transições:

- Repouso + toque → Armado, e qualquer outro item armado volta a Repouso.
- Armado + toque no mesmo item → Gravando → Repouso, item fora da lista ativa, lançamentos intactos.
- Armado + toque em outro item → o anterior volta a Repouso, o novo fica Armado.
- Recarregar a tela → todos em Repouso.

Não há entidade nova de banco. O id do item armado vive só na lista do Orçamento daquela visita.

## Região principal

| Tela | Região |
|------|--------|
| Resumo, Orçamento, Lançamentos, Ano | Uma região principal nova, destino `conteudo`. |
| Ajustes | A região que já existe, mesmo destino. |
| Chrome, login, cadastro, página inicial | Fora desta fatia, exceto o salto no chrome do app. |

O salto é o primeiro controle do chrome e aponta para `conteudo`.

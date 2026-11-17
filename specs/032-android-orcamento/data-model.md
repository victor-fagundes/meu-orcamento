# Data model: Orçamento no Android

## Grupo

| Campo | Origem |
|-------|--------|
| Plano, realizado, ainda cabe | `totais.porGrupo` |
| Frase | Campo novo, mesma função de texto do computador |
| Sem movimento | Plano e realizado iguais a zero |

## Item no sheet

| Campo | Regra |
|-------|--------|
| Doze meses | `planoCentavos` inteiros de `GET /api/v1/plano` |
| Mês editado | O índice da competência aberta |
| Gravação | `PUT` com os doze inteiros. Um mês muda. Os outros permanecem. |

## Arquivar

Repouso mostra "Arquivar {nome}". Armado mostra "Confirmar arquivar {nome}". Confirmar tira o item da lista ativa. Lançamentos com aquele `itemId` permanecem.

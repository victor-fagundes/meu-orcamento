# Tokens · Meu Orçamento · v0.1

Status: **proposta para aprovação**. Os valores em `tokens.css` são os que já estão nos artefatos, exceto onde a seção "Ajustes propostos" indica mudança.

## Escalas

### Espaço (base 4)
4 · 8 · 12 · 16 · 24 · 32 · 48

### Raio
8 (sm) · 12 (md) · 14 (lg) · 16 (xl) · 20 (2xl) · 28 (sheet) · full

### Elevação
- 0: nenhuma (separação por cor de superfície)
- 1: cartões, `0 1px 2px` a 6%
- 2: menus e painéis flutuantes, `0 8px 24px` a 16%
- FAB: `0 4px 12px` com azul a 30%

### Tipo (Manrope)
| Papel | Tamanho / linha | Uso |
|---|---|---|
| Display LG | 56 / 60 | Saldo principal no web |
| Display MD | 40 / 44 | Saldo principal no celular |
| Title LG | 28 / 32 | Título de tela |
| Title MD | 20 / 24 | Título de sheet, painel e cartão |
| Body | 16 / 24 | Texto de campo e de lista |
| Label | 14 / 20 | Apoio, rótulo de linha |
| Caption | 12 / 16 | Legenda, rótulo de campo, tabela |

### Movimento
- Rápido 150 ms · Base 200 ms · Lento 300 ms
- Easing: `cubic-bezier(0.2, 0, 0, 1)`
- Com "reduzir movimento" ativo: duração zero.

## Ajustes propostos (para aprovar)

Hoje alguns valores usados nos artefatos não estão na escala. Proposta de mapeamento:

| Valor atual | Proposta | Onde aparece |
|---|---|---|
| 14 px de espaço | 12 ou 16 | Entre campos e rótulos |
| 20 px de espaço | 16 ou 24 | Padding de cartões web |
| 28 px de espaço | 24 ou 32 | Margem de seção no web |
| Raio 14 | Mantido como `lg` | Campos e botões |
| Raio 20 | Mantido como `2xl` | Cartões web |

Pergunta: aprova a escala de espaço base 4 e o mapeamento acima? Se sim, eu aplico nos componentes e nos artefatos.

## Pendências
- Tema escuro: mapeamento de cada token para o tema escuro, a ser definido.
- Fonte: Manrope no rebuild web (spec 040). Roboto sai do layout.
- Verde de sucesso: `--md-success`, aguardando a passada nos canvases.

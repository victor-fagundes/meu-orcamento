# Style guide · Meu Orçamento · v1.0 (documentação)

Esta é a página única do design system. Cada item aponta para o documento que tem o detalhe. Quando houver conflito, vale o documento citado.

## 1. Fundamentos
| Tema | Onde está | Resumo |
|---|---|---|
| Marca | `DECISOES_identidade_visual.md` (seção 1) | Carteira em quadrado amarelo. Amarelo só na marca. |
| Cor | `tokens.css`, `TOKENS.md` | Ação azul; texto, superfície e linhas neutros; sucesso verde; atenção e erro com tons próprios. |
| Tema escuro | `TEMA-ESCURO.md` | Mesmos nomes de token, valores próprios. Contraste validado. |
| Tipo | `TOKENS.md` | Manrope embutida. Escala de 40/44 a 12/16. |
| Espaço e raio | `TOKENS.md` | Escala de 4 em 4. Raios 8, 12, 14, 16, 20, 28. |
| Grid | `GRID.md` | Celular: 4 colunas, margem 16. Desktop: barra de 240 px e 12 colunas, margem 40. |
| Elevação e movimento | `TOKENS.md` | Três níveis de sombra. Movimento de 150, 200 e 300 ms; zero com reduzir movimento. |
| Ícones | `ICONES.md` | Material Icons preenchido, 24 px. Um significado por ícone. |

## 2. Componentes
Ficha completa em `COMPONENTES.md`. Resumo:
- **Ações:** botão (primário, secundário, texto, destrutivo), FAB (só celular).
- **Entrada:** campo, seletor de tipo (chips), linha de lista.
- **Estado:** medidor, banner (informação, atenção, erro), snackbar com desfazer.
- **Estrutura:** barra de navegação, sheet (celular), painel lateral (web), diálogo de confirmação, tabela (web).

## 3. Módulos
Composições que se repetem entre telas, em `MODULOS.md`: cabeçalho de tela, bloco de saldo, grade de totais, grupo com medidor, linha de item, linha de lançamento, seletor de tipo, formulário, rodapé de ações, cabeçalho de sheet, cartão de vazio, banner, linha de ajuste, tabela de meses, barra de navegação e snackbar.

## 4. Padrões de uso
- **Uma ação principal por área.** Ação destrutiva fica fora da linha da lista.
- **Formulário:** sheet no celular, painel lateral no web.
- **Confirmação curta:** diálogo centralizado.
- **Criação:** FAB no celular; botão dentro do cartão vazio no web.
- **Desfazer:** exclusão de lançamento mostra snackbar por 10 segundos.
- **Estado vazio:** título, uma frase, uma ação.
- **Estado de erro:** diz o que aconteceu e o que fazer, e mantém os campos preenchidos.
- **Saldos:** "Disponível neste mês" (planejado menos gasto de despesas) e "Sobra no ano" (receitas menos despesas). Não são o mesmo número.

## 5. Conteúdo
- Glossário e padrões de texto em `MICROCOPY.md`.
- Formatos pt-BR: moeda, data, percentual.
- Tom direto, sem exclamação em erro, sem conselho financeiro na interface.

## 6. Implementação
Regras em `IMPLEMENTACAO.md`: tokens como única fonte, nomes, pastas, dinheiro em centavos, acessibilidade, regras de negócio em `domain/`, segurança e revisão.

## 7. Governança e verificação
- Mudança de token ou componente: nota curta com problema, proposta e impacto; versão conforme `README.md`.
- Checklist de revisão de tela em `README.md`.
- Verificação automática: contraste dos tokens, acessibilidade por tela.
- Verificação visual em celular e desktop, em navegador real.
- Teste de usabilidade com cinco pessoas nas tarefas do one-pager.

## 8. Onde está cada coisa
| Artefato | Local |
|---|---|
| Tokens | `design-system/tokens.css` e `TOKENS.md` |
| Fonte | `design-system/fonts/` |
| Canvas do app (sistema) | faixa "0 · Sistema de design" em https://claude.ai/artifact/9SoCdoMece5XJnhscQa8RP |
| Telas do app | https://claude.ai/artifact/9SoCdoMece5XJnhscQa8RP |
| Telas do web | https://claude.ai/artifact/1oBD8K8Ux4FPixJvQPDRnp |
| Protótipo navegável | `prototipo-android.html` |

## Pendências conhecidas
- Telas do canvas ainda não seguem integralmente o grid, a ficha de componentes e os módulos. A revisão é tela por tela.
- Seis artboards precisam de revisão de fonte no canvas do app (já aplicada; confirmar na verificação visual).
- Tema escuro depende de teste visual.
- Lint para tokens e convenções de nome depende de ferramenta do time.

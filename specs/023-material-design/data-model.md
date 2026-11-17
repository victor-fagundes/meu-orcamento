# Data Model: Material Design

Nenhuma entidade nova. Nenhuma coluna nova. Os valores continuam inteiros em centavos nas funções e nas tabelas que já existem.

## Tema (só apresentação)

Dois conjuntos, escolhidos por `prefers-color-scheme`. Não há registro na conta.

| Papel | Uso | Claro | Escuro |
|---|---|---|---|
| Ação | Botão principal, aba ativa, barra de progresso normal | Família de `#0057B8` | Azul claro correspondente do protótipo |
| Sobre a ação | Texto do botão principal | Branco | Azul escuro |
| Superfície | Fundo da página e da barra | Claro, não navy | Escuro do protótipo |
| Amarelo de marca | Marca, alerta preventivo, série Realizado | `#FFE600` | Amarelo do protótipo escuro |
| Erro | Estouro e “ainda pode gastar” negativo | Vermelho do protótipo | Vermelho claro do protótipo |

O amarelo não pinta a barra nem o botão principal.

## Controles que mudam de pele

| Controle de hoje | Passa a ser | Dado que carrega |
|---|---|---|
| `auth-btn` preenchido | Botão oficial preenchido | O mesmo `type`, `onClick` ou `href` |
| `auth-btn` secundário | Botão oficial contornado ou de texto | Igual |
| `sheet-field` texto | Campo oficial | O mesmo valor e rótulo |
| `sheet-field` select | Select oficial | As mesmas opções |
| Chip de tipo ou filtro | Chip oficial | A mesma seleção |
| Barra de consumo | Progresso oficial | A mesma porcentagem, teto visual 100 |
| Seta de mês, editar, excluir | Botão de ícone | A mesma ação |

## Sheet global

Não persiste estado. Aberto ou fechado vive só na tela.

| Entrada | Origem | Regra |
|---|---|---|
| Itens ativos | `listItensAtivosParaLancamento` da sessão | A mesma lista do seletor atual, inclusive a preferência de item da 022 |
| Cartões ativos | `listCartoesAtivos` da sessão | Igual |
| Competência sugerida | `?mes=` válido da URL, senão mês corrente | Não grava competência diferente da action atual |
| Rascunho | Campos do formulário | Cancelar, Escape ou toque fora descarta |

A action de criar lançamento, o plano do item e o item novo não ganham campo.

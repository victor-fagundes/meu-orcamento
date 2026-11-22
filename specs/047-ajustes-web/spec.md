# Spec: 047 — Ajustes web

**Status:** `ready`  
**Release:** rebuild-web  
**Sprint:** —  
**Depende de:** 040, 041, 042  
**PRD:** 5.7, 5.9, 5.10, 5.11, D-06, D-08  
**Branch:** `rebuild-web`

## Context

`/app/ajustes` reúne conta, categorias, cartões, limites, arquivados, exportação, dados de exemplo e exclusão da conta. Importar planilha e importar fatura continuam no back como estão. Na navegação desta versão ficam ocultos pela flag `IMPORTACAO_V1=false`.

Categorias usam a API e as actions da spec 041. Itens arquivados são só leitura: não há desarquivar.

O perfil no topo mostra avatar, nome, e-mail e o caminho "Esqueci a senha". Em Conta, a pessoa escolhe Claro, Escuro ou Sistema. A escolha grava `mo-tema`, como pede `docs/design/TEMA-ESCURO.md`.

## Goals

1. Organizar Ajustes em dois grupos e isolar "Excluir conta".
2. Renomear e arquivar categorias, e criar categoria, com as validações da 041.
3. Manter cartões, limites, exportação, exemplo e exclusão da conta com os textos e as confirmações já decididos.

## Non-goals

- Implementar de novo a importação de planilha ou de PDF.
- Desarquivar item ou categoria.
- Reordenar.
- Prazo de 30 dias para apagar a conta (D-06: exclusão imediata).

## Domain rules

Menu, nesta ordem:

| Grupo | Entradas |
|---|---|
| Dia a dia | Categorias e itens, Conta, Cartões, Limites de alerta, Itens arquivados |
| Dados e arquivos | Importar planilha (oculto com `IMPORTACAO_V1=false`), Importar fatura (oculto com a mesma flag), Exportar, Dados de exemplo |
| Fora dos grupos | Excluir conta, no fim, em destaque destrutivo |

| Caso | Entrada | Resultado |
|---|---|---|
| Categorias | Lista por tipo | Contagem de itens ativos. Renomear e Arquivar ficam em `MenuAcoes` |
| Nova categoria | Tipo e nome | `FormularioContainer`. Nome inválido ou duplicado no tipo mostra o erro da 041 e não grava |
| Arquivar categoria | Confirmação | `Dialogo` "Arquivar Lazer? Os itens saem do Orçamento. Os lançamentos antigos continuam." Depois, "Categoria arquivada." Arquiva a categoria e os itens do grupo. Lançamentos ficam |
| Tema | Conta | Claro, Escuro ou Sistema. Grava `mo-tema` |
| Itens arquivados | Aba | Somente leitura. Sem botão de desarquivar |
| Limite | Inteiro 1–100 | Grava |
| Limite fora | 0, 101 ou texto | Erro no campo. O valor salvo volta para o controle |
| Cartão | Apelido obrigatório | Dia de fechamento 1–28, vencimento 1–31. Fechamento vazio mostra o aviso de competência no mês da compra. Desativar pede `Dialogo`. Cartão com histórico não é apagado |
| Exportar | CSV ou JSON, com movimento | Arquivo da spec 017 |
| Exportar | Sem movimento | "Não havia movimento para exportar." |
| Exportar | Geração incompleta | "Arquivo incompleto não é compartilhado." |
| Exemplo | Primeiro toque | Arma a ação, ainda não grava |
| Exemplo | Segundo toque | Confirma e a mensagem diz quantos itens mudaram |
| Excluir conta | Passo 1 | Aviso e o botão para o passo 2 |
| Excluir conta | Passo 2 | O campo precisa ser exatamente `EXCLUIR`. Outra frase mostra erro e a ação destrutiva fica inativa. A frase certa apaga conta e orçamento na hora e encerra a sessão |
| Sair | Confirmação | `Dialogo`. Só então a sessão acaba |

## Acceptance criteria

- [ ] AC-1 O menu tem os dois grupos e "Excluir conta" isolado no fim. Com `IMPORTACAO_V1=false`, Importar planilha e Importar fatura não aparecem.
- [ ] AC-2 O topo mostra `Avatar`, nome, e-mail e "Esqueci a senha". Sair abre `Dialogo` e só então encerra a sessão.
- [ ] AC-3 Categorias e itens tem as abas Categorias e Itens arquivados. Categorias lista por tipo com contagem. Renomear e Arquivar só aparecem em `MenuAcoes`.
- [ ] AC-4 Nova categoria pede tipo e nome. Duplicata no tipo não grava e mostra o erro da 041. Arquivar usa "Arquivar {nome}? Os itens saem do Orçamento. Os lançamentos antigos continuam." e, ao concluir, "Categoria arquivada." Os lançamentos continuam na lista.
- [ ] AC-4b Em Conta, Claro, Escuro e Sistema gravam `mo-tema` e a tela muda na hora.
- [ ] AC-5 Itens arquivados não têm ação de desarquivar.
- [ ] AC-6 Limite fora de 1–100 mostra erro e restaura o valor salvo. Dentro do intervalo, grava.
- [ ] AC-7 Cartões: listar, adicionar, editar e desativar com `Dialogo`. Fechamento vazio mostra o aviso. Fechamento fora de 1–28 ou vencimento fora de 1–31 não grava.
- [ ] AC-8 Exportar CSV e JSON usa as duas frases da spec 041 quando não há movimento ou o arquivo não fecha. Com movimento, o arquivo segue a spec 017.
- [ ] AC-9 Dados de exemplo só grava no segundo toque e a mensagem inclui a quantidade de itens alterados.
- [ ] AC-10 Excluir conta em dois passos: a ação destrutiva só fica ativa com a frase `EXCLUIR`. Frase diferente não apaga nada.
- [ ] AC-11 A regra de tokens do ESLint passa. Só componentes do DS. Rótulos visíveis, foco visível, teclado nos diálogos e painéis. Light, dark e `prefers-reduced-motion`. Nada de `@material/web`. A aba Ajustes continua ativa nestas subtelas (042).
- [ ] AC-12 O E2E cria uma categoria, arquiva com o nome, tenta um limite 101, exporta sem movimento e percorre os dois passos de excluir conta sem confirmar a frase errada. A captura vai para `tests/visual/out/`, sem pixel-diff bloqueante.
- [ ] AC-13 Nenhum `console.log`, `any` ou TODO novo.

## Test plan

E2E Playwright do AC-12. A conta usada no passo de excluir é uma conta de teste, e o E2E não confirma `EXCLUIR` nela se isso apagaria a massa das outras asserts; o passo confirma que o botão segue inativo com frase diferente.  
Checklist de `packages/design-system/CHECKLIST.md` no PR.

## Open questions

Nenhuma. `IMPORTACAO_V1=false` é o padrão desta versão.

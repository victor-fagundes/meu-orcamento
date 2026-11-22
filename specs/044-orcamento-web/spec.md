# Spec: 044 — Orçamento web

**Status:** `ready`  
**Release:** rebuild-web  
**Sprint:** —  
**Depende de:** 040, 041, 042  
**PRD:** 5.3, 5.6, 5.10  
**Branch:** `rebuild-web`

## Context

`/app/orcamento` mostra o mês por tipo, categoria e item. Categorias deixam de ser só o texto do grupo: criar, renomear e arquivar usam a spec 041. O atalho "Gerenciar" abre Ajustes já no tipo.

A frase de cada item na linha nova é a de `fraseDoEstado` (`packages/design-system/src/modulos/logica.ts`): "Dentro do planejado", "Perto do limite · N%", "No limite do planejado", "Estourou em R$ …" e "Sem valor planejado". O cálculo de percentual continua o do domínio, sem dividir por zero.

## Goals

1. Listar o tipo escolhido, com categorias recolhíveis e itens.
2. Criar categoria e item no conteúdo, editar o plano e arquivar com o nome.
3. Copiar plano sem inventar ano anterior.

## Non-goals

- Reordenar categorias ou itens.
- Desarquivar.
- FAB.
- Mudar a regra de alerta ou de competência.

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Tipo | Um de R, F, V, E | Lista só desse tipo. O total diz "de R$ x planejados", com x sem centavos |
| Categoria | Cabeçalho | `GrupoComMedidor`, recolhível, `aria-expanded` |
| Item | Linha | `LinhaItem` e a frase de `fraseDoEstado` |
| Gerenciar | Atalho no cabeçalho do tipo | Vai a Ajustes > Categorias e itens, filtrado por esse tipo |
| Novo item | Categoria | Sugestões das categorias ativas do tipo, ou um nome novo. Nome novo cria a categoria (041) |
| Plano | Valor em centavos, ≥ 0 | `CampoMoeda` dentro de `FormularioContainer` (painel 460). `Switch` "Aplicar também aos próximos meses" |
| Arquivar item | Confirmação | Título "Arquivar Mercado?". Descrição: "Ele sai do Orçamento e de novos lançamentos. Os lançamentos antigos continuam." (`docs/design/MICROCOPY.md`) |
| Copiar mês anterior | Mês com plano anterior | Copia o plano do mês anterior para o mês aberto |
| Aplicar a todos | Um valor | Copia esse valor aos 12 meses |
| Copiar ano anterior | Não há plano do ano anterior | Mensagem de que não há o que copiar. Os doze valores não mudam |
| Vazio do tipo | Nenhum item ativo | `CartaoVazio` |
| Alerta | Atenção ou estouro | `Banner` de atenção ou de erro, com texto, não só cor |

"Nova categoria" e "Novo item" ficam no topo do conteúdo, não flutuantes. Cancelar, toque fora e voltar não gravam.

## Acceptance criteria

- [ ] AC-1 Os chips têm as quatro opções de tipo e o total do tipo usa "de R$ x planejados".
- [ ] AC-2 Cada categoria é `GrupoComMedidor` com `aria-expanded`. Cada item é `LinhaItem` com a frase de `fraseDoEstado`.
- [ ] AC-3 "Gerenciar" abre Ajustes > Categorias e itens filtrado pelo tipo que está na tela.
- [ ] AC-4 "Nova categoria" cria pelo caso de uso da 041. "Novo item" oferece as categorias ativas e aceita um nome novo, que vira categoria na mesma gravação.
- [ ] AC-5 Editar o plano abre `FormularioContainer` com `CampoMoeda`, o `Switch` "Aplicar também aos próximos meses" e `RodapeAcoes`. O painel devolve o foco ao fechar.
- [ ] AC-6 Arquivar pede "Arquivar {nome}?" e a frase "Ele sai do Orçamento e de novos lançamentos. Os lançamentos antigos continuam." Só então arquiva. O histórico de lançamentos permanece.
- [ ] AC-7 "Copiar mês anterior" e "Aplicar a todos os meses" gravam o plano em centavos. "Copiar ano anterior" sem ano anterior não altera valor nenhum e mostra a mensagem.
- [ ] AC-8 Vazio do tipo usa `CartaoVazio`. Alerta usa `Banner`. Carregando usa `Skeleton`. Erro usa `EstadoErro`.
- [ ] AC-9 A regra de tokens do ESLint passa. Só componentes do DS. Rótulos visíveis, foco visível, teclado no painel e no diálogo. Light, dark e `prefers-reduced-motion`. Nada de `@material/web`.
- [ ] AC-10 O E2E cria uma categoria, cria um item nela, grava o plano do mês e arquiva o item pelo diálogo com o nome. A captura vai para `tests/visual/out/`, sem pixel-diff bloqueante.
- [ ] AC-11 Nenhum `console.log`, `any` ou TODO novo. Centavos só na borda viram texto.

## Test plan

E2E Playwright do AC-10.  
Unit da 041 continua verde. Checklist de `packages/design-system/CHECKLIST.md` no PR.

## Open questions

Nenhuma.

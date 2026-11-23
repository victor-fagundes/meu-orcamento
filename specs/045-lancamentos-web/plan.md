# Implementation Plan: Lançamentos web

**Branch**: `045-lancamentos-web` | **Date**: 2026-11-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/045-lancamentos-web/spec.md`

## Summary

A página `/app/lancamentos` deixa de usar `LancamentosView`. Passa a mostrar a competência do mês numa `Tabela`, com busca e filtros na query, e a registrar, editar e excluir no painel do pacote. A conta da fatura e a divisão dos centavos continuam em `buildLancamentoDraft`, `planEditLancamento` e `planDeleteLancamento`. O mês sobe para o cabeçalho da casca. Excluir fecha o painel e leva o foco a "Registrar". Salvar uma edição devolve o foco à linha, ou a "Registrar" se a linha saiu do mês.

## Technical Context

**Language/Version**: TypeScript estrito, Next.js 15 App Router

**Primary Dependencies**: `@meu-orcamento/design-system` (`Tabela`, `CampoBusca`, `Select`, `CampoMoeda`, `CampoData`, `Campo`, `Switch`, `FormularioContainer`, `Dialogo`, `Snackbar`, `CartaoVazio`, `Skeleton`, `EstadoErro`, `Botao`), `criarLancamentoAction`, `editarLancamentoAction`, `excluirLancamentoAction`, `desfazerExclusaoAction`, `buildLancamentoDraft`, `planEditLancamento`, `planDeleteLancamento`

**Storage**: Nenhuma tabela nova. Busca, item e pagamento ficam na query. O desfazer de 10 segundos guarda as linhas removidas no estado da tela, como a action já devolve. Ocultar valores lê a chave `mo-ocultar-valores` que o Resumo já grava.

**Testing**: Vitest do filtro, da prévia, do texto de parcela e do selo da fatura. Os testes de `lancamentos.ts`, `edit-lancamento.ts` e `delete-lancamento.ts` permanecem. Playwright em `e2e/lancamentos.spec.ts` com a conta demo, no claro e no escuro. Captura em `tests/visual/out/`, sem pixel-diff. Smoke no `quickstart.md`.

**Target Platform**: App web local. A janela estreita é este site. O Android não entra.

**Project Type**: Aplicação web existente. Esta história troca o miolo de Lançamentos. A casca da história 042 passa a pedir mês também nesta área.

**Performance Goals**: Abrir o mês é a leitura que a página já faz. Sem meta nova de tempo. Sem animação nova. Com `prefers-reduced-motion`, painel e diálogo não transitam.

**Constraints**: Domínio sem Next, React ou Drizzle. Centavos inteiros. Estilo novo em `src/app` e `src/components` não usa hexadecimal nem `px`/`rem`/`dp` solto. O painel de 460 px já está no CSS do pacote. Sem `console.log`, sem `any`. A página nova não importa `@material/web`. `LancamentosView` permanece no repositório até a história 049. `competencia.ts` não muda. Não há `MenuAcoes`: excluir fica no fim do painel de edição.

**Scale/Scope**: Um orçamento, um mês de competência. Busca e filtros não saem desse mês. Sem intervalo de datas. Sem botão flutuante. Sem campo de observação.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Domain Purity | PASS | Prévia, texto de parcela, selo e filtro saem de função pura. A página chama `buildLancamentoDraft`, `planEditLancamento` e `planDeleteLancamento`. Não cria outra competência nem outra divisão de centavos. |
| II. Integer Money | PASS | O valor gravado continua em centavos. `lerBRL` rejeita a terceira casa. A tela recusa vazio, zero e negativo com a frase da spec. `formatarBRL` só na borda. A máscara é texto, não outro número. |
| III. Spec-Driven Delivery | PASS | A spec 045 está `ready`, com as duas respostas da sessão de 2026-11-23. |
| IV. Vertical Slice | PASS | A entrega é a página usável: lista, busca, registro à vista, parcelamento, edição por alcance, exclusão com desfazer, vazio, carregando e erro. |
| V. Simplicity & Isolation | PASS | Sem tabela nova, sem rota HTTP nova, sem segunda chave de ocultar. A query e as actions continuam filtradas por `orcamentoId`. |

**Post-design re-check**: PASS. `data-model.md` não cria tabela. `contracts/lancamentos.md` cobre a lista, a busca, o painel, a prévia, os dois alcances e o foco. O pacote só ganha conteúdo opcional e confirmação desabilitada no `Dialogo`, e a linha da `Tabela` passa a ser alcançável pelo teclado.

## Project Structure

### Documentation (this feature)

```text
specs/045-lancamentos-web/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── lancamentos.md
├── checklists/requirements.md
└── tasks.md                 # /speckit-tasks — não criado aqui
```

### Source Code (repository root)

```text
src/app/app/lancamentos/page.tsx
src/app/app/lancamentos/loading.tsx
src/app/app/lancamentos/error.tsx
src/components/lancamentos-tela.tsx
src/components/casca-abas.ts
src/components/casca-abas.test.ts
src/domain/lancamentos-lista.ts
src/domain/lancamentos-lista.test.ts
src/domain/lancamentos.ts
src/domain/edit-lancamento.ts
src/domain/delete-lancamento.ts
packages/design-system/src/base/contratos.ts
packages/design-system/src/web/dialogo.tsx
packages/design-system/src/web/tabela.tsx
packages/design-system/src/native/dialogo.tsx
e2e/lancamentos.spec.ts
```

**Structure Decision**: A rota já é `src/app/app/lancamentos/page.tsx`. O servidor continua dono da leitura do mês e das parcelas irmãs que caem em outros meses. O cliente guarda o painel, os diálogos, o snackbar e a chave de ocultar, e escreve busca e filtros na query. `LancamentosView` sai da página e fica no repositório até a história 049. A casca desenha o mês. A página não repete as setas.

## Complexity Tracking

Nenhuma violação. A história entrega a tela inteira em cima do domínio e das actions que já existem. O `Dialogo` ganha o miolo do alcance porque hoje só tem título, frase e dois botões.

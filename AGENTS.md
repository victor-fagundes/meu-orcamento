# AGENTS.md — Meu Orçamento

Regras obrigatórias para qualquer agente (Cursor) neste repo.

## Workspace

- Root: este diretório (`meu-orcamento` sob `.cursor/projects`).
- **Não** gravar artefatos do projeto em `Downloads` ou home soltos.

## SDD (obrigatório)

1. Antes de editar código: ler a spec em `specs/*/spec.md` da história atual.
2. Só implementar se status da spec for `ready` (ou `implemented` em correção).
3. Domínio em `src/domain` — sem import de Next, DB ou React.
4. Valores monetários: inteiros (centavos). Proibido float no domínio.
5. Ao concluir task: marcar checkbox em `tasks.md` e AC em `spec.md`.
6. Histórias Release B (import) não entram até Release A verified.

## Fatia vertical (obrigatório)

Cada história/card (MO-xxx) entrega **back + front juntos** na mesma entrega.

- Não fechar “só API” ou “só tela placeholder” e empurrar UI para depois.
- Definition of Done da história = domínio/DB + API/use-case + UI usável alinhada ao protótipo.
- Exceção: infra pura (ex.: secret, migrate) quando a própria história for só isso — e ainda assim com smoke na UI se houver fluxo.

## Fonte da verdade

| Tema | Arquivo |
|------|---------|
| Produto | `docs/PRD_Meu_Orcamento_v1_0.txt` |
| Arquitetura | `docs/ARCHITECTURE_Meu_Orcamento.md` |
| Processo | `docs/SDD_Meu_Orcamento.md` |
| Decisões Q/D | `docs/DECISOES_ASSUMIDAS_v1_0.md` |
| UX referência | `prototype/Meu_Orcamento_prototipo_v3.html` |

## Ordem de trabalho atual

Release A e Release B `verified` (PM 2026-11-16). Specs 001–022 `verified`.  
Spec 025 `implemented` (chegar no mês). Spec 027 Android `implemented` (casca). Spec **028** `implemented`: Resumo e Orçamento no Android exibem os totais do mês calculados em `totaisDoMes`.  
Specs **029–037** `implemented` (17 nov 2026). 029 revisa o computador. 030–036 são a casca e as telas Android. 037 fecha o GAP-007 no computador: foco ao abrir o diálogo, Arquivar nomeia o item na confirmação e região principal. O roteiro no aparelho das specs 030–036 continua em aberto. Spec **038** `implemented`: a aparência Material do Android (mês na barra, valor em display, entrada com a marca). O roteiro no aparelho da 038 continua em aberto.
Spec **040** `Cancelled` (17 nov 2026): o PM manteve a 039. Spec **039** `implemented`: acabamento do Android segundo `prototype/2026-11-17-acabamento.html` (ícone, splash, Manrope, seis telas, menus de Ajustes com os ícones do site). O roteiro no aparelho da 039 continua em aberto. Falta o PM marcar `verified` (025, 027, 028, 029–039).  
GAP-001…006 fechados. GAP-007 no computador está implementado na spec 037 e segue aberto até o PM marcar `verified`. No Android, o foco do sheet e o nome de Arquivar estão na spec 032.

Rebuild do front web (22 nov 2026), branch `rebuild-web`. A branch `legacy-front` marca o commit anterior a este rebuild. Specs **040–049** estão `ready`:

- `specs/040-ds-integrado-next`
- `specs/041-categorias`
- `specs/042-shell-web`
- `specs/043-resumo-web`
- `specs/044-orcamento-web`
- `specs/045-lancamentos-web`
- `specs/046-ano-web`
- `specs/047-ajustes-web`
- `specs/048-entrada-web`
- `specs/049-remocao-front-antigo`

A pasta `specs/040-replicar-front-prototipo` continua Cancelled (17 nov 2026) e não é a spec 040 deste rebuild. Não implementar 049 antes de 043–048 `verified` pelo PM. Specs 050–057 (mobile) não começam agora.

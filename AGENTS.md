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
GAP-001, GAP-002, GAP-004 e GAP-005 fechados.  
Próximo em aberto, sem fatia confirmada: GAP-006 (Resumo) ou GAP-007 (sheet). GAP-003 segue no parking lot.

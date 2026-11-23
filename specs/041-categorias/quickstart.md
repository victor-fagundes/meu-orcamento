# Quickstart: Categorias

Validação depois da implementação. A spec precisa estar `ready`. Isto não substitui o Vitest.

## Pré-requisitos

- Branch `rebuild-web`
- `npm test` e `npx tsc --noEmit` verdes
- App em `http://localhost:3000` com a conta demo, para o limite e a exportação
- Duas contas só no teste de aplicação (o PGlite em memória). Não há segunda conta demo na tela.

## Teste automático

```bash
npm test -- src/domain/categorias.test.ts src/domain/alertas.test.ts src/domain/reconciliacao.test.ts src/application/categorias.test.ts
npx tsc --noEmit
```

O teste de domínio cobre: vazio, só espaços, 40 caracteres, 41 caracteres, `"Lazer\n"`, `"  Lazer  "` gravado como `Lazer`, `lazer` e `Ação`/`acao` no mesmo tipo, o mesmo nome em outro tipo, renomear para o mesmo nome, categoria arquivada que não bloqueia o nome.

`reconciliacao.test.ts` precisa continuar com a mesma conta do mês e do ano. `src/domain/competencia.ts` não entra no diff.

O teste de aplicação abre dois orçamentos. O segundo não lista, não renomeia e não arquiva a categoria do primeiro.

Os casos de `contracts/categorias.md` e `contracts/limite-e-exportacao.md` ficam verdes antes do smoke.

## 1. O que já existia

1. Subir o app numa base que já tem itens.
2. Chamar `GET /api/v1/categorias` com a sessão demo.
3. Esperado: um registro por tipo e nome de grupo, com o mesmo nome. Lançamento antigo continua no mesmo item.

## 2. Nome

1. `POST /api/v1/categorias` com `{ "tipo": "V", "nome": "  Lazer  " }`. Esperado: 201 e nome `Lazer`.
2. Repetir com `lazer`. Esperado: 400 e “Escolha outro nome. Já existe uma categoria com esse nome neste tipo.”
3. Criar `Lazer` em `F`. Esperado: 201.

## 3. Renomear e arquivar

1. Renomear a Moradia de despesas fixas para Casa.
2. Esperado: os itens que eram Moradia nesse tipo passam a Casa. Um lançamento de Aluguel continua no Aluguel, com o mesmo valor e a mesma competência. Moradia de outro tipo, se existir, não muda.
3. Arquivar Lazer.
4. Esperado: a lista sem arquivadas omite Lazer. Os itens daquele grupo ficam arquivados. O lançamento antigo continua na lista de lançamentos.

## 4. Limite

1. Em Ajustes, com o limite em 80, tentar salvar 0.
2. Esperado: a mensagem de erro, sem “Limites salvos.”
3. Recarregar Ajustes. Esperado: o valor salvo continua 80.
4. Salvar 100. Esperado: “Limites salvos.” e, ao recarregar, 100.

## 5. Exportar

1. Numa conta sem lançamento e sem plano diferente de zero, exportar JSON.
2. Esperado: “Não havia movimento para exportar.” e nenhum download.
3. Numa conta com um lançamento, exportar CSV e JSON.
4. Esperado: os dois arquivos baixam, com centavos inteiros, só daquela conta.

Não há tela nova de categoria neste passo. Criar pela interface entra na história 044.

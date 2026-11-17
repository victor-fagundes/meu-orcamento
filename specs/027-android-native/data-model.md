# Data Model: Android Native App

Nenhuma tabela Neon nova. O app Android é cliente do modelo já persistido pelo web (024). Este documento descreve **entidades de sessão/cliente** e o **espelho de leitura** que a API v1 devolve.

## Server (unchanged ownership)

| Entity | Owner | Notes |
|--------|--------|-------|
| User / Session / Account | Better Auth + Drizzle | Mesmo fluxo web |
| Orçamento | `orcamentos` | 1 por user; escopo de todas as queries |
| Item / Cartão / Lançamento / Plano / Limites | schema atual | Regras em `src/domain` + `src/application` |
| Import preview (éphèmero) | memória server-side | Como hoje; sem persistir arquivo |

## Client-only

### AuthSession (device)

| Field | Type | Rules |
|-------|------|--------|
| cookies / session token | opaque | Persistido de forma segura; limpo no sign-out |
| baseUrl | string | Release = produção; debug pode divergir |
| userEmail | string? | Cache de UI opcional; não é fonte de auth |

**Transitions**: signed-out → signing-in → signed-in → signed-out | session-invalid (401 → tela de login).

### UiCompetencia

| Field | Type | Rules |
|-------|------|--------|
| competencia | `YYYY-MM` | Seleção de mês na UI; defaults alinhados ao web |
| source | user / nav | Não recalcula fechamento de cartão localmente |

### MoneyAmount

| Field | Type | Rules |
|-------|------|--------|
| centavos | Long / JSON int | Sempre inteiro; display BRL só na UI |

## API resource shapes (logical)

Espelham application; campos monetários em **centavos**.

- **ResumoMes**: totais + listas resumidas da competência
- **Lancamento**: id, itemId, descrição, valorCentavos, dataTransacao, competencia, meio/cartaoId, parcelas…
- **PlanoLinha** / **Item** / **Cartao** / **Limite** / **Alerta**: como o web já expõe nas telas
- **ImportPreview** / **ImportConfirmResult**: preview + contagens; erros tipados
- **ExportPayload**: bytes + content-type (csv/json)

## Validation (client)

- Não enviar float para dinheiro.
- Não inventar competência offline.
- Em 401/403: limpar sessão local e voltar ao login.
- Em falha de rede: estado offline recuperável; não montar orçamento fantasma.

## Identity & concurrency

- Identidade = userId Better Auth → orcamentoId no servidor.
- Concorrência web↔Android: **last write wins** no registro salvo por último com sucesso.

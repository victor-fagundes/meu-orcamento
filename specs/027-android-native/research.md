# Research: Android Native App

## 1. Client stack

**Decision**: Kotlin + Jetpack Compose + Material 3 + Navigation Compose. HTTP com OkHttp (CookieJar persistente) + kotlinx.serialization.

**Rationale**: Atende FR-006 (UI nativa, não WebView). Compose é o caminho atual do Android; Material 3 alinha visualmente ao web Material (023) sem copiar pixels. OkHttp CookieJar cobre sessão Better Auth baseada em cookie sem reinventar auth.

**Alternatives considered**:
- **WebView / TWA do site** — rejeitado na spec (paridade nativa, não casco).
- **Flutter / React Native** — possíveis, mas aumentam stack paralela; PM pediu nativo; Compose fica no ecossistema Android puro.
- **Ktor Client only** — ok como alternativa a OkHttp; OkHttp escolhido pela maturidade do CookieJar e exemplos Better Auth.

## 2. How the phone talks to the cloud

**Decision**: Adicionar **API JSON `/api/v1/*`** no Next.js (Route Handlers) que autentica a sessão e chama `src/application/*`. Web continua com Server Actions. Domínio permanece só no servidor.

**Rationale**: O produto hoje não expõe REST — só `"use server"` actions. App nativo precisa de contrato HTTP estável (ver [contracts/api-v1.md](./contracts/api-v1.md)). Encaminhar para application evita fork de competência/centavos/import.

**Alternatives considered**:
- **Invocar Server Actions do Android** — frágil (IDs de action, multipart RSC); rejeitado.
- **Reimplementar regras em Kotlin** — viola Domain Purity e FR-010.
- **GraphQL/tRPC** — overhead para um cliente solo; JSON REST fino basta.

## 3. Auth & session persistence

**Decision**: Email/senha via Better Auth em `/api/auth/*` (já em produção). Cliente Android guarda cookies de sessão (CookieJar + armazenamento criptografado). Sessão sobrevive a restart até sign-out ou invalidação no servidor (FR-001). Release APK usa `BETTER_AUTH_URL` / host de produção. Ajustar `trustedOrigins` se o sign-in nativo exigir origem adicional; se cookies falharem em edge cases, habilitar **bearer token** Better Auth como plano B documentado nas tasks — sem mudar o modelo de “uma conta / um orçamento”.

**Rationale**: Mesma identidade da web (024). Cookie jar é o menor delta sobre o auth atual. Persistência atende clarificação A da sessão.

**Alternatives considered**:
- **OAuth-only / magic link** — fora do produto atual.
- **Login a cada cold start** — rejeitado na clarificação.
- **Duplicar usuário local demo** — proibido (FR-012).

## 4. Money & competência on the client

**Decision**: JSON transporta **centavos como integer**; Kotlin usa `Long`. Formatação BRL só na UI. Competência e fechamento de cartão calculados **no servidor**; Android envia inputs (data, meio/cartão) e exibe o que a API devolve. Sem cache offline de totais (clarificação B).

**Rationale**: FR-003/FR-004/FR-010. Evita float e segunda regra de competência.

**Alternatives considered**: Enviar `valorBRL` string como as actions web — aceitável na borda, mas integer centavos no contrato reduz ambiguidade no cliente nativo.

## 5. Concurrent edits & offline

**Decision**: Last write wins (clarificação A); sem UI de merge. Offline: mensagem recuperável; sem read-cache garantido e sem fila de writes (FR-009).

**Rationale**: Alinha ao comportamento típico das actions atuais e às clarificações do clarify.

**Alternatives considered**: Optimistic locking / choose-version UI — rejeitados na spec. Offline-first — fora de escopo.

## 6. Delivery & environments

**Decision**: Gradle gera APKs intermediários por fatia (auth → core → ajustes → import/export). **Release/aceitação** embute base URL de **produção** apenas (FR-015, SC-007). Debug pode usar `localhost`/túnel. Play Store fora. minSdk **34** (Android 14+).

**Rationale**: Clarificações B (intermediários) e A (prod only). Sideload cobre SC-006.

**Alternatives considered**: Feature completa só no APK final sem intermediários — rejeitado. Switch de ambiente no APK de release — rejeitado.

## 7. Import / export / files

**Decision**: Upload multipart para os mesmos limites do web (4 MB). Preview/confirm no app; parsers continuam server-side. Export devolve arquivo (CSV/JSON) para o storage do usuário via Storage Access Framework / sharesheet.

**Rationale**: FR-007; parsers já existem em `src/lib` + application; não rodar PDF/xlsx no dispositivo nesta feature.

**Alternatives considered**: Parse no aparelho — duplicaria domínio e bibliotecas; rejeitado.

# Research: Produção na nuvem

## 1. Onde publicar o app e o banco

**Decision**: Vercel para o Next.js (runtime Node, região `gru1`) e Neon para o Postgres (AWS `sa-east-1`). Plano Hobby e Neon Free enquanto o uso for pessoal.

**Rationale**: `docs/ARCHITECTURE_Meu_Orcamento.md` já fixou essa dupla para o MVP. Os dois têm região em São Paulo, então o celular no Brasil não cruza os EUA à toa. HTTPS e o domínio `*.vercel.app` vêm da Vercel, o que cobre o primeiro dia sem comprar domínio. O free tier do Neon suspende o compute ocioso; a primeira abertura depois disso leva alguns segundos e o dado permanece. Isso cabe no SC-001 para uso pessoal.

**Alternatives considered**: VPS, Fly ou Railway. Rejeitado: a arquitetura cortou operação extra para um PM-dev. Supabase no lugar do Neon. Rejeitado: o schema e o Better Auth já estão no app; trocar de auth agora reabre uma decisão fechada. Edge runtime. Rejeitado: PDF (`pdfjs-dist`) e planilha (`xlsx`) rodam no Node, e `next.config.ts` já marca esses pacotes como externos ao bundle.

## 2. Como o servidor escolhe o banco

**Decision**: Se `DATABASE_URL` existe, Drizzle usa o pacote `postgres` já instalado, com `max: 1` e `prepare: false`. Se não existe e `NODE_ENV` não é `production`, continua o PGlite atual. Se é `production` e a URL não existe, `getDb()` lança erro e não cria conta demo.

**Rationale**: `src/db/index.ts` hoje sempre abre PGlite em `data/pglite` e chama `ensureDevUser`. Na Vercel o disco é efêmero e somente leitura fora de `/tmp`; cada instância teria um banco vazio e a pasta nem pode ser criada. O pacote `postgres` já está em `package.json` e não é usado. `prepare: false` é obrigatório na connection pooled do Neon (PgBouncer em modo transaction). `max: 1` evita estourar o limite de conexões quando várias instâncias serverless acordam. O seed em `src/db/seed-dev-user.ts` já retorna em `NODE_ENV=production`; o buraco é o servidor nem chegar a esse modo porque o PGlite quebra antes.

**Alternatives considered**: `@neondatabase/serverless`. Rejeitado nesta história: mais um driver, e o app não está no Edge. Exigir Neon também no `npm run dev`. Rejeitado pela D-06: desenvolver não pode depender de conta na nuvem. `DATABASE_MODE=postgres` como segundo interruptor. Rejeitado: a presença da URL já distingue os ambientes e um flag a mais gera combinação inválida (modo postgres sem URL).

## 3. Migração e o que acontece com o dado local

**Decision**: Gerar SQL com `drizzle-kit` a partir de `src/db/schema.ts` para `drizzle/`. Aplicar no Neon com a URL direta (`DATABASE_URL_UNPOOLED`) antes de publicar. A app na Vercel só recebe a URL pooled. Não há migração no boot. `data/pglite` não é copiado. O bootstrap SQL do PGlite permanece para o dev até uma história que una as duas fontes.

**Rationale**: A pasta `drizzle/` não existe. O schema de produção hoje é o `CREATE TABLE` escrito à mão em `src/db/index.ts`, que acompanha `schema.ts` (inclusive `divida`). Drizzle Kit apontando para `DATABASE_URL` pooled costuma falhar ou pendurar por causa de lock de sessão no pooler. Rodar migração em toda instância serverless cria corrida. O dado local é a conta demo e o mês de teste; a spec pede produção vazia, com catálogo só no cadastro (`src/lib/auth.ts` já cria orçamento e chama `seedCatalog`).

**Alternatives considered**: Continuar com `CREATE TABLE IF NOT EXISTS` contra o Neon no boot. Rejeitado: duas fontes de schema já existem; produção precisa da trilha versionada, e o boot no serverless é o lugar errado. Unificar PGlite e Neon no mesmo SQL nesta história. Rejeitado por simplicidade: o local já funciona; o risco de drift fica explícito no contrato e cada mudança de schema atualiza os dois até a unificação. Importar o PGlite para o Neon. Rejeitado pela spec (FR-005).

## 4. Segredo, URL e reset de senha

**Decision**: Em produção, `BETTER_AUTH_SECRET` (32 caracteres ou mais, diferente do fallback do código), `BETTER_AUTH_URL` (HTTPS do app) e `DATABASE_URL` são obrigatórios. O fallback `dev-only-change-me-meu-orcamento-32chars` e `http://localhost:3000` não valem em produção. `trustedOrigins` fica nesse URL. `sendResetPassword` em produção não faz `console.info` do link. A tela de esqueci-senha, em produção, diz que o envio ainda não está disponível.

**Rationale**: `src/lib/auth.ts` publica um segredo fixo se a variável falta. Na Vercel isso autenticaria qualquer um que lesse o repositório. O reset só faz `console.info` do URL; na Vercel esse log é o link de tomar a conta. A arquitetura deixou Resend para depois (“no Sprint 1, login e-mail/senha local basta”). Sem domínio de envio, um e-mail transacional não sai de forma confiável. A história entrega honestidade, não o e-mail.

**Alternatives considered**: Resend nesta história. Rejeitado: pede domínio verificado e um fornecedor novo; a spec coloca o e-mail fora. Desligar a rota de reset. Rejeitado: o link já existe no login; esconder a rota sem explicar deixa a pessoa num beco. Cookie manual. Rejeitado: `nextCookies()` e `baseURL` HTTPS já marcam o cookie seguro.

## 5. Tamanho de planilha e PDF

**Decision**: Teto único de 4 MB em `MAX_IMPORT_BYTES`, `MAX_PDF_BYTES` e `serverActions.bodySizeLimit`. A mensagem passa a dizer 4 MB.

**Rationale**: Os guards locais estão em 10 MB (`src/lib/parse-pdf.ts`, `src/lib/parse-spreadsheet.ts`). O corpo de uma Server Action na Vercel corta perto de 4,5 MB. Acima disso a pessoa vê falha de plataforma, não a mensagem do app. Fatura e planilha do produto cabem em 4 MB. O mesmo teto no local evita “funciona aqui, quebra publicado”.

**Alternatives considered**: Manter 10 MB e subir o limite só no `next.config`. Rejeitado: a Vercel não aceita o corpo de 10 MB nesse runtime. Upload para object storage. Rejeitado: a arquitetura manda processar em memória e não persistir arquivo.

## 6. O que a pessoa precisa ter antes do código ir ao ar

**Decision**: Conta Vercel, projeto Neon em `sa-east-1`, repositório Git que a Vercel consiga ler, e três segredos no painel (URL pooled, segredo de auth, URL pública). A URL direta fica só na máquina que roda `npm run db:migrate`. Não commitar `.env` nem `.env.local` (já estão no `.gitignore`).

**Rationale**: Sem esses quatro itens o plano não tem onde gravar. Nesta sessão o comando `git` não estava no PATH do terminal; publicar pela integração GitHub exige o Git instalado e o remoto criado, fora desta história de código. Restore do próprio Neon cobre o backup do MVP. Não há segundo backup.

**Alternatives considered**: Vercel CLI sem Git remoto. Aceitável como atalho, pior para o próximo deploy. Domínio próprio no dia 1. Rejeitado: `*.vercel.app` já é HTTPS estável; domínio entra quando o reset por e-mail precisar de remetente.

## 7. Fora desta história

**Decision**: Não entrar PostHog (spec 018 permanece no console), domínio próprio, Resend, exclusão com espera de 30 dias, cópia do PGlite, nem unificação do SQL de bootstrap com `drizzle/`.

**Rationale**: A constituição pede o menor corte que cumpre o aceite. Esses itens não bloqueiam conta real, HTTPS e dado que sobrevive ao deploy.

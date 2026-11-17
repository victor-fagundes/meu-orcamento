# Quickstart: Produção na nuvem

Guia de validação da spec 024. Não substitui `tasks.md`. O código só deve ser exercitado aqui depois da implementação, com a spec em `ready`.

Detalhes de variável, driver e ordem de deploy: [ambiente](./contracts/ambiente.md), [persistência](./contracts/persistencia.md), [publicação](./contracts/deploy.md). Schema: [data-model](./data-model.md).

## Antes de publicar

1. Conta na [Vercel](https://vercel.com) e projeto Neon em São Paulo (`sa-east-1`).
2. Código num repositório Git que a Vercel leia. Git não estava no PATH deste ambiente; instalar e criar o remoto faz parte deste passo, fora do app.
3. No Neon, copiar a connection pooled e a connection direta. Não colar nenhuma das duas no Git.
4. Gerar um segredo de 32 caracteres ou mais, diferente de `dev-only-change-me-meu-orcamento-32chars`.

## Dev local continua igual

```powershell
npm run dev
```

Sem `DATABASE_URL` no ambiente.

Esperado:

- Abre em `http://localhost:3000`.
- Login aceita `demo@local.test` / `demo1234`.
- Ajustes ainda mostra a nota de desenvolvimento.
- Dados em `data/pglite`, pasta que o Git ignora.

## Primeira produção

Na máquina que tem a URL direta (não commitar):

```powershell
$env:DATABASE_URL_UNPOOLED = "<url direta do Neon>"
npm run db:migrate
```

Na Vercel, ambiente Production:

- `DATABASE_URL` = URL pooled
- `BETTER_AUTH_SECRET` = o segredo novo
- `BETTER_AUTH_URL` = `https://<nome>.vercel.app`

Região da função: `gru1`. Deploy.

Esperado: o site abre em HTTPS. O banco Neon não tem a conta demo.

## Smoke no celular

Fora da rede de casa, no endereço publicado:

1. Login não vem preenchido com o e-mail demo.
2. Criar uma conta. O Resumo abre com o catálogo e sem lançamentos. Tempo até aqui, descontando a digitação: menos de 2 minutos. A primeira abertura depois de um tempo parado pode levar alguns segundos.
3. Gravar um lançamento de R$ 10,00 no mês visível.
4. Ajustes não mostra `data/pglite` nem `demo1234`.
5. Criar uma segunda conta em janela anônima. O lançamento de R$ 10,00 não aparece no Resumo, no Orçamento, nos Lançamentos, no Ano nem em Ajustes.
6. Pedir “Esqueci a senha”. A frase não fala em terminal. O log da Vercel não contém um URL de redefinição.
7. Publicar de novo. Na primeira conta, o lançamento de R$ 10,00 continua no mesmo mês.
8. Enviar uma planilha ou PDF de 5 MB. A mensagem diz 4 MB e nenhum lançamento novo aparece. Um arquivo de cerca de 1 MB segue a importação de hoje.

## Produção mal configurada

Tirar `DATABASE_URL` ou `BETTER_AUTH_SECRET` do ambiente de preview (não do production que acabou de passar no smoke) e abrir o app.

Esperado: falha de configuração. Nenhuma conta `demo@local.test` no Neon. O texto mostrado não inclui o segredo.

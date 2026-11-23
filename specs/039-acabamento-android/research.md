# Research: Acabamento do Android

## 1. Réplica do protótipo

**Decision**: A referência de implementação é `prototype/2026-11-17-acabamento.html`. A ordem dos blocos continua a da spec 038. O número principal deixa o peso regular da spec 038 e passa a Manrope extra-negrito, o maior texto da tela. Corpo e títulos usam a mesma família, em peso menor.

**Rationale**: A spec 039 pede o número mais pesado que a barra e que o corpo. A spec 038 deixou 45 sp em peso normal, e é isso que ainda parece formulário. Os números de exemplo do HTML não entram na conta.

**Alternatives considered**: Manter Roboto e só aumentar o peso. Rejeitado. O protótipo propõe Manrope, e a Roboto do aparelho varia. Desenhar outra família. Rejeitado. O PM ainda não trocou a referência.

## 2. Ícone e splash

**Decision**: O manifesto aponta para o ícone adaptativo em `mipmap-anydpi-v26`. Fundo `#FFE600`. Frente é a letra M em `#221B00`, dentro da zona segura. Há camada de uma cor só para a gaveta escura. A splash usa os atributos nativos do Android 12 (`windowSplashScreenBackground` e `windowSplashScreenAnimatedIcon`) no tema da janela, com o mesmo amarelo e a mesma marca. A atividade fica em pé (`screenOrientation=portrait`).

**Rationale**: O manifesto hoje aponta para `drawable/ic_launcher`, um quadrado azul com losango, e o tema é `Theme.Material.Light` sem splash. No minSdk 34 a splash da plataforma basta. Não entra dependência de compatibilidade.

**Alternatives considered**: Biblioteca `core-splashscreen`. Rejeitada. O mínimo da plataforma já cobre o aparelho. Losango amarelo sobre azul. Rejeitado pela spec.

## 3. Atualizar por cima

**Decision**: `versionCode` passa de 1 para 2. `versionName` permanece `1.0.0`. O nome do APK continua `MeuOrcamento-${versionName}-${versionCode}-${variant}.apk`.

**Rationale**: O mesmo `versionCode` faz o aparelho recusar a instalação por cima. A spec pede a entrega nova sem desinstalar. O nome comercial não foi pedido para mudar.

**Alternatives considered**: Subir também o `versionName`. Adiado. Não está na spec. Pedir desinstalar. Rejeitado.

## 4. Ajustes como lista

**Decision**: A tela Ajustes é a lista do protótipo: conta com ícone de pessoa e os nove menus, ícone à esquerda, subtítulo, azul, e Excluir conta em vermelho. Tocar abre o fluxo e deixa Ajustes selecionado na barra de baixo. Cartões, limites, importar planilha, importar fatura e exportar reaproveitam as telas atuais. Simulador, arquivados, dados de exemplo e excluir conta são destinos novos.

**Rationale**: Hoje Ajustes embute formulário na própria rolagem e não tem quatro menus do site. A lista separa o menu do miolo, como o quadro.

**Alternatives considered**: Sanfona no lugar, igual ao site. Rejeitada no telefone. O quadro usa linha com seta, e o miolo de importar já é outra tela. Copiar os ícones como desenho novo. Rejeitado. O módulo já tem os ícones Material estendidos, os mesmos nomes do site.

## 5. Simulador sem copiar a regra

**Decision**: `POST /api/v1/competencia/simular` recebe data ISO, número de parcelas e dia de fechamento. A rota chama `competenciasParcelas` em `src/domain/competencia.ts` e devolve a primeira competência e a lista `YYYY-MM`. O app formata o mês civil em pt-BR. Sem cartão ativo, a tela diz para cadastrar um, como o site.

**Rationale**: A constituição impede reimplementar competência no app. Não havia rota. O site calcula no navegador importando o domínio. O aparelho não importa TypeScript.

**Alternatives considered**: Portar a função para Kotlin. Rejeitado. Duas regras. Embutir o domínio num artefato compartilhado. Rejeitado. Grande demais para um pré-visualizador.

## 6. Arquivados e exemplo

**Decision**: `GET /api/v1/itens?escopo=arquivados` devolve só arquivados, via `listItensArquivados`. Sem o parâmetro, a rota continua a lista ativa que Lançamentos já usa. `POST /api/v1/catalogo/exemplo` chama `applyExamplePlans` e devolve quantos itens mudaram. O app pede confirmação no segundo toque, como o site, e não cria lançamento. Excluir conta continua `DELETE /api/v1/conta` com a frase `EXCLUIR`, depois do passo “Quero excluir minha conta…”.

**Rationale**: Arquivados e exemplo existem na página do site por função de servidor, sem rota para o app. A exclusão já tem rota e a mesma frase.

**Alternatives considered**: Incluir arquivados no `GET /api/v1/itens` padrão. Rejeitado. O seletor de lançamento passaria a vê-los. Server Action chamada pelo app. Rejeitada. O cliente Android não fala o protocolo de ação do Next.

## 7. Tema escuro

**Decision**: O protótipo desenha o claro. O escuro mantém as superfícies da spec 038, a mesma hierarquia, os mesmos rótulos e a marca amarela. Sem interruptor em Ajustes.

**Rationale**: A spec manda seguir o aparelho e não desenha o escuro de novo.

**Alternatives considered**: Segundo quadro escuro antes de implementar. Rejeitado. A spec já fechou a herança da 038.

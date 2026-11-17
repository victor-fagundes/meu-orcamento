# Spec: 002 — Catálogo inicial (MO-201)

**Status:** `verified`  
**Release:** A  
**Sprint:** 1  
**Histórias:** MO-201  
**PRD:** 5.9

## Context

O primeiro acesso precisa de um orçamento utilizável, sem lançamento e sem plano inventado. O catálogo padrão é a lista fechada abaixo. “Carregar exemplo” é outra ação, em Ajustes, e não roda no cadastro.

## Goals

1. O cadastro cria o orçamento e todos os itens do catálogo padrão, cada um com plano de 12 meses em 0 centavos.
2. Não existe lançamento nesse orçamento.
3. “Carregar exemplo” só grava planos de exemplo depois de confirmação explícita em Ajustes.

## Non-goals

- Criar ou arquivar item (MO-202).
- Renomear ou reordenar (D-07, fora desta versão).
- Editar o plano mensal (MO-203).
- Lançamento (MO-303).

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Cadastro | Usuário novo confirma a conta | 1 orçamento, 0 lançamentos, 1 item por nome da lista, plano `[0,0,0,0,0,0,0,0,0,0,0,0]` centavos |
| Lista | As linhas `Tipo\|Categoria\|Item,Item` | R Receitas: Salário, Aluguel, Pensão, 13º salário / Férias, PLR / Bônus / Comissão, Outros. F Moradia: Aluguel, Condomínio, Financiamento casa*, Diarista/Mensalista, Seguro da casa, IPTU. F Educação: Colégio, Faculdade, Idiomas / cursos. F Transporte: Prestação do carro*, Seguro do carro, IPVA. F Saúde: Plano de saúde, Academia. F Outros: Seguro de vida, Empréstimos*, Outros. V Habitação: Luz, Internet / TV, Água, Gás, Telefone / celular, Outros. V Transporte: Combustível, Estacionamento, Taxi, Ônibus / metrô, Outros. V Alimentação: Supermercado, Feira / padaria, Outros. V Lazer: Viagens/Passeios, Cinema/teatro, Restaurantes/bares, Clube, Outros. V Outros: Tarifas Banco, Outros. E Educação: Material escolar, Uniforme, Outros. E Saúde: Médico / Hospital, Medicamentos, Outros. E Manutenção/prevenção: Carro, Casa, Outros. E Vestuário: Roupas, Calçados, Acessórios, Outros. E Cuidados pessoais: Corte de cabelo, Estética/Manicure, Farmácia / Drogaria, Outros. E Outros: Presentes, Outros Impostos, Outros |
| Exemplo | Usuário não confirma | Planos permanecem 0 |
| Exemplo | Usuário confirma em Ajustes | Só então os planos de exemplo são gravados |

## Acceptance criteria

- [x] AC-201.1 O cadastro cria o orçamento e todos os itens da tabela, com plano 12×0 centavos.
- [x] AC-201.2 A tela Orçamento mostra tipo, categoria e item com R$ 0,00 planejado e R$ 0,00 realizado.
- [x] AC-201.3 A lista de lançamentos desse orçamento tem 0 linhas.
- [x] AC-201.4 Sem confirmação, nenhum plano de exemplo é gravado. Com confirmação em Ajustes, os planos de exemplo passam a ser os valores de exemplo.

## Test plan

Unit: contagem e nomes iguais à tabela desta spec.  
E2E: cadastro novo abre Orçamento em zero e Lançamentos vazio.

## Open questions

Nenhuma. D-07 tira renomear e reordenar desta versão.

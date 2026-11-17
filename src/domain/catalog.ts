/**
 * Catálogo padrão (PRD 5.9 / protótipo).
 * Valores de exemplo em centavos — só aplicados via “Carregar exemplo”.
 */

export type TipoOrcamento = "R" | "F" | "V" | "E";

export const TIPOS_LABEL: Record<TipoOrcamento, string> = {
  R: "Receitas",
  F: "Despesas fixas",
  V: "Despesas variáveis",
  E: "Anuais / eventuais",
};

const BASE = `R|Receitas|Salário,Aluguel,Pensão,13º salário / Férias,PLR / Bônus / Comissão,Outros
F|Moradia|Aluguel,Condomínio,Financiamento casa*,Diarista/Mensalista,Seguro da casa,IPTU
F|Educação|Colégio,Faculdade,Idiomas / cursos
F|Transporte|Prestação do carro*,Seguro do carro,IPVA
F|Saúde|Plano de saúde,Academia
F|Outros|Seguro de vida,Empréstimos*,Outros
V|Habitação|Luz,Internet / TV,Água,Gás,Telefone / celular,Outros
V|Transporte|Combustível,Estacionamento,Taxi,Ônibus / metrô,Outros
V|Alimentação|Supermercado,Feira / padaria,Outros
V|Lazer|Viagens/Passeios,Cinema/teatro,Restaurantes/bares,Clube,Outros
V|Outros|Tarifas Banco,Outros
E|Educação|Material escolar,Uniforme,Outros
E|Saúde|Médico / Hospital,Medicamentos,Outros
E|Manutenção/prevenção|Carro,Casa,Outros
E|Vestuário|Roupas,Calçados,Acessórios,Outros
E|Cuidados pessoais|Corte de cabelo,Estética/Manicure,Farmácia / Drogaria,Outros
E|Outros|Presentes,Outros Impostos,Outros`;

/** Reais → centavos nos planos de exemplo (protótipo). */
export const EXAMPLE_PLANS_BRL: Record<string, number> = {
  "R|Receitas|Salário": 6500,
  "F|Moradia|Aluguel": 1800,
  "F|Moradia|Condomínio": 450,
  "F|Saúde|Plano de saúde": 520,
  "F|Saúde|Academia": 120,
  "V|Habitação|Luz": 180,
  "V|Habitação|Internet / TV": 120,
  "V|Alimentação|Supermercado": 1200,
  "V|Alimentação|Feira / padaria": 250,
  "V|Lazer|Restaurantes/bares": 350,
  "V|Transporte|Combustível": 400,
  "E|Vestuário|Roupas": 200,
};

export type CatalogItemSeed = {
  tipo: TipoOrcamento;
  grupo: string;
  nome: string;
  divida: boolean;
  key: string;
};

export function buildCatalogSeeds(): CatalogItemSeed[] {
  return BASE.split("\n").flatMap((line) => {
    const [tipo, grupo, nomes] = line.split("|") as [TipoOrcamento, string, string];
    return nomes.split(",").map((raw) => {
      const divida = raw.endsWith("*");
      const nome = raw.replace(/\*$/, "");
      return {
        tipo,
        grupo,
        nome,
        divida,
        key: `${tipo}|${grupo}|${nome}`,
      };
    });
  });
}

export function zeroPlanoJson(): string {
  return JSON.stringify(Array(12).fill(0));
}

export function planoJsonFromBRL(valor: number): string {
  const cents = Math.round(valor * 100);
  return JSON.stringify(Array(12).fill(cents));
}

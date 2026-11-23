import { and, eq } from "drizzle-orm";
import type { Db } from "@/db";
import { categorias, itens, limitesAlerta } from "@/db/schema";
import type { TipoOrcamento } from "@/domain/catalog";
import {
  ERRO_CATEGORIA_NAO_ENCONTRADA,
  ERRO_TIPO_INVALIDO,
  TIPOS_CATEGORIA,
  chaveNome,
  nomeCanonico,
  validarNomeCategoria,
  validarNomeUnicoNoTipo,
} from "@/domain/categorias";

const ORDEM_TIPO: Record<string, number> = { R: 0, F: 1, V: 2, E: 3 };

export type CategoriaLista = {
  id: string;
  tipo: string;
  nome: string;
  arquivada: boolean;
};

export type CategoriaFalha =
  | { ok: false; code: "validacao"; error: string }
  | { ok: false; code: "nao_encontrado"; error: string };

type Executor = Pick<Db, "select" | "insert" | "update">;

function falhaValidacao(error: string): CategoriaFalha {
  return { ok: false, code: "validacao", error };
}

function naoEncontrada(): CategoriaFalha {
  return { ok: false, code: "nao_encontrado", error: ERRO_CATEGORIA_NAO_ENCONTRADA };
}

export async function preencherCategoriasExistentes(db: Db): Promise<void> {
  const rows = await db.select().from(itens);
  const groups = new Map<string, typeof rows>();
  for (const row of rows) {
    const key = `${row.orcamentoId}\0${row.tipo}\0${row.grupo.toLowerCase()}`;
    const list = groups.get(key) ?? [];
    list.push(row);
    groups.set(key, list);
  }

  const existentes = await db.select().from(categorias);
  for (const list of groups.values()) {
    const nome = nomeCanonico(list.map((row) => ({ grupo: row.grupo, arquivado: row.arquivado })));
    const sample = list[0];
    if (!sample || !nome) continue;
    for (const row of list) {
      if (row.grupo === nome) continue;
      await db
        .update(itens)
        .set({ grupo: nome, updatedAt: new Date() })
        .where(and(eq(itens.id, row.id), eq(itens.orcamentoId, row.orcamentoId)));
    }
    const arquivada = !list.some((row) => row.arquivado === 0);
    const jaExiste = existentes.some(
      (cat) =>
        cat.orcamentoId === sample.orcamentoId &&
        cat.tipo === sample.tipo &&
        cat.nome.toLowerCase() === nome.toLowerCase() &&
        cat.arquivada === arquivada,
    );
    if (!arquivada) {
      const ativa = existentes.some(
        (cat) =>
          cat.orcamentoId === sample.orcamentoId &&
          cat.tipo === sample.tipo &&
          cat.nome.toLowerCase() === nome.toLowerCase() &&
          cat.arquivada === false,
      );
      if (ativa) continue;
    } else if (jaExiste) {
      continue;
    }
    const id = crypto.randomUUID();
    await db.insert(categorias).values({
      id,
      orcamentoId: sample.orcamentoId,
      tipo: sample.tipo,
      nome,
      arquivada,
    });
    existentes.push({
      id,
      orcamentoId: sample.orcamentoId,
      tipo: sample.tipo,
      nome,
      arquivada,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

export async function listarCategorias(
  db: Db,
  orcamentoId: string,
  opts: { incluirArquivadas?: boolean } = {},
): Promise<CategoriaLista[]> {
  const rows = await db
    .select()
    .from(categorias)
    .where(eq(categorias.orcamentoId, orcamentoId));
  const visiveis = opts.incluirArquivadas ? rows : rows.filter((row) => !row.arquivada);
  return visiveis
    .map((row) => ({
      id: row.id,
      tipo: row.tipo,
      nome: row.nome,
      arquivada: row.arquivada,
    }))
    .sort((a, b) => {
      const tipo = (ORDEM_TIPO[a.tipo] ?? 9) - (ORDEM_TIPO[b.tipo] ?? 9);
      if (tipo !== 0) return tipo;
      return a.nome.localeCompare(b.nome, "pt-BR");
    });
}

export async function garantirCategoriaAtiva(
  db: Executor,
  orcamentoId: string,
  tipo: TipoOrcamento,
  nomeValidado: string,
): Promise<{ ok: true; id: string } | CategoriaFalha> {
  const ativos = await db
    .select()
    .from(categorias)
    .where(
      and(
        eq(categorias.orcamentoId, orcamentoId),
        eq(categorias.tipo, tipo),
        eq(categorias.arquivada, false),
      ),
    );
  const chave = chaveNome(nomeValidado);
  const encontrada = ativos.find((row) => chaveNome(row.nome) === chave);
  if (encontrada) return { ok: true, id: encontrada.id };
  const id = crypto.randomUUID();
  await db.insert(categorias).values({
    id,
    orcamentoId,
    tipo,
    nome: nomeValidado,
    arquivada: false,
  });
  return { ok: true, id };
}

export async function criarCategoria(
  db: Db,
  orcamentoId: string,
  input: { tipo: string; nome: string },
): Promise<{ ok: true; id: string; tipo: string; nome: string; arquivada: false } | CategoriaFalha> {
  if (!TIPOS_CATEGORIA.includes(input.tipo as TipoOrcamento)) {
    return falhaValidacao(ERRO_TIPO_INVALIDO);
  }
  const nome = validarNomeCategoria(input.nome);
  if (!nome.ok) return falhaValidacao(nome.error);
  const tipo = input.tipo as TipoOrcamento;

  return db.transaction(async (tx) => {
    const ativos = await tx
      .select()
      .from(categorias)
      .where(
        and(
          eq(categorias.orcamentoId, orcamentoId),
          eq(categorias.tipo, tipo),
          eq(categorias.arquivada, false),
        ),
      );
    const unico = validarNomeUnicoNoTipo(nome.nome, ativos);
    if (!unico.ok) return falhaValidacao(unico.error);
    const id = crypto.randomUUID();
    await tx.insert(categorias).values({
      id,
      orcamentoId,
      tipo,
      nome: nome.nome,
      arquivada: false,
    });
    return { ok: true as const, id, tipo, nome: nome.nome, arquivada: false as const };
  });
}

export async function renomearCategoria(
  db: Db,
  orcamentoId: string,
  categoriaId: string,
  nomeInformado: string,
): Promise<{ ok: true; id: string; tipo: string; nome: string; arquivada: boolean } | CategoriaFalha> {
  return db.transaction(async (tx) => {
    const [atual] = await tx
      .select()
      .from(categorias)
      .where(and(eq(categorias.id, categoriaId), eq(categorias.orcamentoId, orcamentoId)))
      .limit(1);
    if (!atual) return naoEncontrada();

    if (!nomeInformado.includes("\n") && !nomeInformado.includes("\r")) {
      const trim = nomeInformado.trim();
      if (trim === atual.nome) {
        return {
          ok: true as const,
          id: atual.id,
          tipo: atual.tipo,
          nome: atual.nome,
          arquivada: atual.arquivada,
        };
      }
    }

    const nome = validarNomeCategoria(nomeInformado);
    if (!nome.ok) return falhaValidacao(nome.error);

    const ativos = await tx
      .select()
      .from(categorias)
      .where(
        and(
          eq(categorias.orcamentoId, orcamentoId),
          eq(categorias.tipo, atual.tipo),
          eq(categorias.arquivada, false),
        ),
      );
    const outros = ativos.filter((row) => row.id !== atual.id);
    const unico = validarNomeUnicoNoTipo(nome.nome, outros);
    if (!unico.ok) return falhaValidacao(unico.error);

    await tx
      .update(categorias)
      .set({ nome: nome.nome, updatedAt: new Date() })
      .where(and(eq(categorias.id, atual.id), eq(categorias.orcamentoId, orcamentoId)));
    await tx
      .update(itens)
      .set({ grupo: nome.nome, updatedAt: new Date() })
      .where(
        and(
          eq(itens.orcamentoId, orcamentoId),
          eq(itens.tipo, atual.tipo),
          eq(itens.grupo, atual.nome),
        ),
      );

    const [limite] = await tx
      .select()
      .from(limitesAlerta)
      .where(eq(limitesAlerta.orcamentoId, orcamentoId))
      .limit(1);
    if (limite) {
      let cats: Record<string, unknown> = {};
      try {
        const parsed = JSON.parse(limite.catsJson) as unknown;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          cats = parsed as Record<string, unknown>;
        }
      } catch {
        cats = {};
      }
      if (Object.prototype.hasOwnProperty.call(cats, atual.nome)) {
        cats[nome.nome] = cats[atual.nome];
        delete cats[atual.nome];
        await tx
          .update(limitesAlerta)
          .set({ catsJson: JSON.stringify(cats), updatedAt: new Date() })
          .where(eq(limitesAlerta.orcamentoId, orcamentoId));
      }
    }

    return {
      ok: true as const,
      id: atual.id,
      tipo: atual.tipo,
      nome: nome.nome,
      arquivada: atual.arquivada,
    };
  });
}

export async function arquivarCategoria(
  db: Db,
  orcamentoId: string,
  categoriaId: string,
): Promise<{ ok: true; id: string; arquivada: true } | CategoriaFalha> {
  return db.transaction(async (tx) => {
    const [atual] = await tx
      .select()
      .from(categorias)
      .where(and(eq(categorias.id, categoriaId), eq(categorias.orcamentoId, orcamentoId)))
      .limit(1);
    if (!atual) return naoEncontrada();
    await tx
      .update(categorias)
      .set({ arquivada: true, updatedAt: new Date() })
      .where(and(eq(categorias.id, atual.id), eq(categorias.orcamentoId, orcamentoId)));
    await tx
      .update(itens)
      .set({ arquivado: 1, updatedAt: new Date() })
      .where(
        and(
          eq(itens.orcamentoId, orcamentoId),
          eq(itens.tipo, atual.tipo),
          eq(itens.grupo, atual.nome),
        ),
      );
    return { ok: true as const, id: atual.id, arquivada: true as const };
  });
}

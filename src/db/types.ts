import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "./schema";

/** Consultas Drizzle. O PGlite local devolve o mesmo formato. */
export type Db = PostgresJsDatabase<typeof schema>;

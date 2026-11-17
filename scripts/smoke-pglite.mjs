import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

try {
  const client = await PGlite.create();
  await client.exec(`create table if not exists t (id text primary key);`);
  const db = drizzle({ client });
  console.log("pglite ok", await client.query("select 1 as n"));
} catch (e) {
  console.error("pglite fail", e);
  process.exit(1);
}

// Kjør seed.sql mot databasen på Supabase.
// Bruker pooler-tilkoblingen siden direkte tilkobling krever IPv6.
//
// Forventer i .env.local (eller miljøet):
//   SUPABASE_PROJECT_REF        (f.eks. cygsdzebbwozortpriix)
//   SUPABASE_DB_PASSWORD        (database-passordet, samme som CLI bruker)
//
// Pooler-region utledes fra config — for nye prosjekter er det vanligvis
// aws-1-eu-central-1.pooler.supabase.com. Overstyr med SUPABASE_DB_HOST om nødvendig.

import { Client } from "pg";
import { readFile } from "node:fs/promises";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env.local") });

const ref = process.env.SUPABASE_PROJECT_REF;
const password = process.env.SUPABASE_DB_PASSWORD;
const host =
  process.env.SUPABASE_DB_HOST ?? "aws-0-eu-west-1.pooler.supabase.com";
const port = Number(process.env.SUPABASE_DB_PORT ?? 5432);

if (!ref || !password) {
  console.error(
    "Mangler SUPABASE_PROJECT_REF eller SUPABASE_DB_PASSWORD i .env.local",
  );
  process.exit(1);
}

const seedFile = join(__dirname, "..", "supabase", "seed", "seed.sql");
const sql = await readFile(seedFile, "utf8");

const client = new Client({
  host,
  port,
  database: "postgres",
  user: `postgres.${ref}`,
  password,
  ssl: { rejectUnauthorized: false },
});

console.log(`Kobler til ${host} (project ${ref})...`);
await client.connect();

try {
  console.log(`Kjører seed.sql (${sql.length} tegn)...`);
  await client.query(sql);
  console.log("Seed fullført.");
} catch (err) {
  console.error("Seed feilet:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}

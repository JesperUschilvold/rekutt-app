// Rask sanity-sjekk av schema-utvidelsene fra leveranse 05a.
import { Client } from "pg";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env.local") });

const client = new Client({
  host: process.env.SUPABASE_DB_HOST ?? "aws-0-eu-west-1.pooler.supabase.com",
  port: Number(process.env.SUPABASE_DB_PORT ?? 5432),
  database: "postgres",
  user: `postgres.${process.env.SUPABASE_PROJECT_REF}`,
  password: process.env.SUPABASE_DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

console.log("\nuser_role enum-verdier:");
const { rows: enumRows } = await client.query(`
  select enumlabel from pg_enum
   where enumtypid = 'public.user_role'::regtype
   order by enumsortorder
`);
for (const r of enumRows) console.log(`  ${r.enumlabel}`);

console.log("\nrisk_areas (count):");
const { rows: ra } = await client.query("select count(*)::int as n from risk_areas");
console.log(`  ${ra[0].n} rader`);

console.log("\nNye tabeller finnes:");
for (const t of ["risk_areas", "procedures", "sign_offs"]) {
  const { rows } = await client.query(
    `select count(*)::int as n from information_schema.tables
      where table_schema = 'public' and table_name = $1`,
    [t],
  );
  console.log(`  ${t.padEnd(12)} ${rows[0].n > 0 ? "OK" : "MANGLER"}`);
}

console.log("\nNye kolonner på modules:");
const { rows: modCols } = await client.query(`
  select column_name from information_schema.columns
   where table_schema = 'public' and table_name = 'modules'
     and column_name in ('risk_area_id', 'requires_sign_off')
`);
for (const r of modCols) console.log(`  modules.${r.column_name}`);

console.log("\nNye kolonner på onboarding_tracks:");
const { rows: tCols } = await client.query(`
  select column_name from information_schema.columns
   where table_schema = 'public' and table_name = 'onboarding_tracks'
     and column_name = 'is_default'
`);
for (const r of tCols) console.log(`  onboarding_tracks.${r.column_name}`);

await client.end();

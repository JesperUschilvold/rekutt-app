// Engangs-verifisering av leveranse 02: tabell-tellinger og RLS-status.
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

const tables = [
  "tenants",
  "users",
  "modules",
  "module_sections",
  "tenant_module_customizations",
  "onboarding_tracks",
  "track_modules",
  "user_tracks",
  "section_completions",
  "reminders",
  "audit_log",
  "data_deletion_requests",
  "subscriptions",
];

console.log("\nTabell-eksistens og rad-tellinger:");
for (const t of tables) {
  const { rows } = await client.query(
    `select count(*)::int as n from public.${t}`,
  );
  console.log(`  ${t.padEnd(32)} ${rows[0].n}`);
}

console.log("\nRLS-status (rowsecurity):");
const { rows: rls } = await client.query(`
  select tablename, rowsecurity
  from pg_tables
  where schemaname = 'public'
  order by tablename
`);
for (const r of rls) {
  console.log(`  ${r.tablename.padEnd(32)} ${r.rowsecurity ? "ON" : "off"}`);
}

console.log("\nAntall RLS-policyer per tabell:");
const { rows: pol } = await client.query(`
  select tablename, count(*)::int as n
  from pg_policies
  where schemaname = 'public'
  group by tablename
  order by tablename
`);
for (const r of pol) console.log(`  ${r.tablename.padEnd(32)} ${r.n}`);

await client.end();

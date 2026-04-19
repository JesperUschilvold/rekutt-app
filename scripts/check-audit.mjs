// Leser siste 20 rader fra audit_log for inspeksjon.
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env.local") });

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const { data, error } = await admin
  .from("audit_log")
  .select("created_at, action, actor_email_snapshot, ip_prefix, user_agent_short, metadata")
  .order("created_at", { ascending: false })
  .limit(20);

if (error) {
  console.error("Feil:", error.message);
  process.exit(1);
}

console.log(`\nSiste ${data.length} rader fra audit_log:\n`);
for (const r of data) {
  const ts = new Date(r.created_at).toLocaleTimeString("nb-NO");
  const meta = JSON.stringify(r.metadata ?? {});
  console.log(
    `${ts}  ${r.action.padEnd(25)} ${(r.actor_email_snapshot ?? "-").padEnd(32)} ${r.ip_prefix ?? "-"}  ${meta === "{}" ? "" : meta}`,
  );
}

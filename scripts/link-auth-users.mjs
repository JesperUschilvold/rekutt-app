// Oppretter auth.users-rader for hver seedet bruker i public.users.
// Trigger public.link_auth_user() (se migrasjon 003) oppdaterer så
// public.users.auth_user_id og setter status = 'active'.
//
// Idempotent: bruker admin.createUser og ignorerer "already exists"-feil.

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Mangler NEXT_PUBLIC_SUPABASE_URL eller SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Hent alle seedede brukere som mangler auth_user_id
const { data: users, error } = await admin
  .from("users")
  .select("id, email, name")
  .is("auth_user_id", null)
  .is("deleted_at", null);

if (error) {
  console.error("Kunne ikke hente users:", error.message);
  process.exit(1);
}

console.log(`Fant ${users.length} brukere uten auth_user_id.\n`);

let created = 0;
let skipped = 0;
let failed = 0;

for (const u of users) {
  const { data, error } = await admin.auth.admin.createUser({
    email: u.email,
    email_confirm: true, // hopper over e-postbekreftelse
    user_metadata: { name: u.name ?? "" },
  });

  if (error) {
    if (error.message.includes("already") || error.status === 422) {
      skipped++;
      console.log(`  ~  ${u.email} (finnes allerede i auth.users)`);
    } else {
      failed++;
      console.log(`  ✗  ${u.email}: ${error.message}`);
    }
    continue;
  }

  created++;
  console.log(`  +  ${u.email} → ${data.user.id}`);
}

console.log(`\nOppsummering: ${created} opprettet, ${skipped} fantes, ${failed} feilet.`);

// Verifiser at alle er lenket
const { data: stillUnlinked } = await admin
  .from("users")
  .select("email")
  .is("auth_user_id", null)
  .is("deleted_at", null);

if (stillUnlinked && stillUnlinked.length > 0) {
  console.warn(
    `\nAdvarsel: ${stillUnlinked.length} brukere fortsatt uten auth_user_id:`,
  );
  for (const u of stillUnlinked) console.warn(`   ${u.email}`);
} else {
  console.log("\nAlle seedede brukere er koblet til auth.users.");
}

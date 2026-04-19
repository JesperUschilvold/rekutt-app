// Engangs-hjelper for utvikling: bytter e-post for én seedet bruker
// slik at du kan motta OTP i en ekte innboks.
//
// Bruk:
//   node scripts/swap-test-email.mjs <gammel-epost> <ny-epost>
//
// Oppdaterer BÅDE auth.users (slik at OTP sendes til rett sted) og
// public.users (slik at get_user_context finner brukeren på ny adresse).

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env.local") });

const [oldEmail, newEmail] = process.argv.slice(2);
if (!oldEmail || !newEmail) {
  console.error("Bruk: node scripts/swap-test-email.mjs <gammel> <ny>");
  process.exit(1);
}

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const { data: appUser, error: appErr } = await admin
  .from("users")
  .select("id, auth_user_id, name")
  .eq("email", oldEmail)
  .maybeSingle();

if (appErr || !appUser) {
  console.error(`Fant ingen public.users-rad for ${oldEmail}`);
  process.exit(1);
}

console.log(`Fant ${appUser.name} (id ${appUser.id}, auth ${appUser.auth_user_id})`);

if (appUser.auth_user_id) {
  const { error: authErr } = await admin.auth.admin.updateUserById(
    appUser.auth_user_id,
    { email: newEmail, email_confirm: true },
  );
  if (authErr) {
    console.error("auth.users-oppdatering feilet:", authErr.message);
    process.exit(1);
  }
  console.log(`auth.users: ${oldEmail} → ${newEmail}`);
}

const { error: updErr } = await admin
  .from("users")
  .update({ email: newEmail })
  .eq("id", appUser.id);

if (updErr) {
  console.error("public.users-oppdatering feilet:", updErr.message);
  process.exit(1);
}

console.log(`public.users: ${oldEmail} → ${newEmail}`);
console.log("\nFerdig. Gå til login-siden og bruk den nye e-posten.");

import { createClient } from "@supabase/supabase-js";
import "server-only";
import type { Database } from "@/types/database";

/**
 * Service-role-klient for Supabase. Omgår all RLS — bruk KUN i server-
 * kode for operasjoner som krever admin-rettigheter (f.eks. tenant-
 * oppslag på subdomene-rute før innlogging).
 *
 * Importerer "server-only" som forårsaker en byggetidsfeil hvis denne
 * filen ved et uhell drar med seg en klient-bundle.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Mangler NEXT_PUBLIC_SUPABASE_URL eller SUPABASE_SERVICE_ROLE_KEY",
    );
  }
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

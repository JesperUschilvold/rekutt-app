import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

type UsersRow = Database["public"]["Tables"]["users"]["Row"];

export type CurrentAppUser = Pick<
  UsersRow,
  "id" | "tenant_id" | "email" | "name" | "role" | "status"
>;

/**
 * Henter den innloggede brukerens rad i public.users, og verifiserer
 * samtidig at brukeren tilhører den forespurte tenant-slugen.
 *
 * Returnerer null hvis:
 * - Ingen sesjon
 * - auth_user_id ikke peker på noen public.users-rad
 * - Brukerens tenant_id peker på en annen tenant enn slug
 * - Brukeren er slettet
 */
export const getCurrentAppUser = cache(
  async (slug: string): Promise<CurrentAppUser | null> => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const admin = createAdminClient();

    const { data: appUser } = await admin
      .from("users")
      .select("id, tenant_id, email, name, role, status")
      .eq("auth_user_id", user.id)
      .is("deleted_at", null)
      .maybeSingle();

    if (!appUser) return null;

    // Verifiser at brukerens tenant matcher subdomene-slugen.
    const { data: tenant } = await admin
      .from("tenants")
      .select("slug")
      .eq("id", appUser.tenant_id)
      .maybeSingle();

    if (!tenant || tenant.slug !== slug) return null;

    return appUser;
  },
);

import { cache } from "react";
import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type Tenant = {
  id: string;
  slug: string;
  name: string;
};

/**
 * Slår opp tenant ut fra slug. Bruker React-cache slik at flere kall
 * innenfor samme request deler resultatet.
 *
 * Bruker service-role-klienten siden subdomene-routing skjer FØR
 * en bruker er autentisert (ingen tenant_id i JWT enda), og RLS
 * derfor ville blokkert oppslaget. Slug og navn er offentlig info
 * (synlig i URL og på velkomstsiden), så det er trygt å eksponere
 * disse via service-role-lookup.
 */
export const getTenantBySlug = cache(
  async (slug: string): Promise<Tenant | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("tenants")
      .select("id, slug, name")
      .eq("slug", slug)
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  },
);

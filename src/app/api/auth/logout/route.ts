import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit/log";

export async function POST() {
  const supabase = await createClient();

  // Hent user før signOut for audit
  const { data: { user } } = await supabase.auth.getUser();
  let tenantId: string | null = null;
  let appUserId: string | null = null;
  let email: string | null = user?.email ?? null;

  if (user) {
    const admin = createAdminClient();
    const { data: appUser } = await admin
      .from("users")
      .select("id, tenant_id, email")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    if (appUser) {
      tenantId = appUser.tenant_id;
      appUserId = appUser.id;
      email = appUser.email;
    }
  }

  await supabase.auth.signOut();

  await logAudit({
    event: "auth.logout",
    tenantId,
    actorUserId: appUserId,
    actorEmail: email,
  });

  return NextResponse.json({ ok: true });
}

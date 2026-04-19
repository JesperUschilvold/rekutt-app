"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit/log";

export type SendOtpResult =
  | { ok: true; email: string }
  | { ok: false; error: string };

export type VerifyOtpResult =
  | { ok: true; redirectTo: string }
  | { ok: false; error: string };

const MAX_OTP_REQUESTS_PER_HOUR = 5;
const MAX_OTP_REQUESTS_PER_DAY = 20;
const MAX_FAILED_VERIFIES = 5;
const SUSPEND_MINUTES = 30;

async function clientIp(): Promise<string | null> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    null
  );
}

async function recordAttempt(
  admin: ReturnType<typeof createAdminClient>,
  email: string,
  tenantSlug: string,
  kind: "otp_requested" | "verify_succeeded" | "verify_failed",
  success: boolean,
) {
  const ip = await clientIp();
  await admin.from("auth_attempts").insert({
    email: email.toLowerCase(),
    tenant_slug: tenantSlug,
    kind,
    success,
    ip_prefix: ip ? ip.split(".").slice(0, 3).join(".") : null,
  });
}

export async function sendOtp(
  slug: string,
  email: string,
): Promise<SendOtpResult> {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) {
    return { ok: false, error: "Skriv inn en gyldig e-postadresse." };
  }

  const admin = createAdminClient();

  // 1) Finnes brukeren i denne tenanten?
  const { data: ctx, error: ctxError } = await admin.rpc("get_user_context", {
    p_email: normalized,
    p_tenant_slug: slug,
  });

  if (ctxError) {
    console.error("get_user_context error:", ctxError.message);
    return { ok: false, error: "Noe gikk galt. Prøv igjen om litt." };
  }

  const userCtx = Array.isArray(ctx) ? ctx[0] : null;
  if (!userCtx) {
    return {
      ok: false,
      error:
        "Vi fant ingen bruker med denne e-posten her. Sjekk om du bruker riktig adresse.",
    };
  }

  // 2) Suspensjon — sjekk at brukeren ikke er blokkert
  const { data: userRow } = await admin
    .from("users")
    .select("suspended_until")
    .eq("id", userCtx.user_id)
    .maybeSingle();

  if (userRow?.suspended_until && new Date(userRow.suspended_until) > new Date()) {
    return {
      ok: false,
      error: `Kontoen er midlertidig sperret. Prøv igjen om ${SUSPEND_MINUTES} minutter.`,
    };
  }

  // 3) Rate limit på OTP-forespørsler
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count: recentCount } = await admin
    .from("auth_attempts")
    .select("id", { count: "exact", head: true })
    .eq("email", normalized)
    .eq("kind", "otp_requested")
    .gte("created_at", oneHourAgo);

  if ((recentCount ?? 0) >= MAX_OTP_REQUESTS_PER_HOUR) {
    return { ok: false, error: "Du har prøvd for mange ganger. Vent en time." };
  }

  const { count: dayCount } = await admin
    .from("auth_attempts")
    .select("id", { count: "exact", head: true })
    .eq("email", normalized)
    .eq("kind", "otp_requested")
    .gte("created_at", oneDayAgo);

  if ((dayCount ?? 0) >= MAX_OTP_REQUESTS_PER_DAY) {
    return { ok: false, error: "For mange forsøk i dag. Kontakt support." };
  }

  // 4) Send OTP via Supabase Auth
  const supabase = await createClient();
  const { error: otpError } = await supabase.auth.signInWithOtp({
    email: normalized,
    options: { shouldCreateUser: false },
  });

  await recordAttempt(admin, normalized, slug, "otp_requested", !otpError);

  if (otpError) {
    console.error("signInWithOtp error:", otpError.message);
    return { ok: false, error: "Kunne ikke sende kode akkurat nå. Prøv igjen." };
  }

  await logAudit({
    event: "auth.otp_requested",
    tenantId: userCtx.tenant_id,
    actorUserId: userCtx.user_id,
    actorEmail: normalized,
  });

  return { ok: true, email: normalized };
}

export async function verifyOtp(
  slug: string,
  email: string,
  token: string,
): Promise<VerifyOtpResult> {
  const normalized = email.trim().toLowerCase();
  const code = token.replace(/\D/g, "");

  if (code.length !== 6) {
    return { ok: false, error: "Koden må være 6 siffer." };
  }

  const admin = createAdminClient();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.verifyOtp({
    email: normalized,
    token: code,
    type: "email",
  });

  if (error || !data.session) {
    console.error(
      `verifyOtp failed for ${normalized}: ${error?.message ?? "no session returned"} (status ${error?.status ?? "-"})`,
    );

    await recordAttempt(admin, normalized, slug, "verify_failed", false);

    // Hent user-context for å kunne oppdatere suspendering
    const { data: ctx } = await admin.rpc("get_user_context", {
      p_email: normalized,
      p_tenant_slug: slug,
    });
    const userCtx = Array.isArray(ctx) ? ctx[0] : null;

    // Telle nylige feilforsøk
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await admin
      .from("auth_attempts")
      .select("id", { count: "exact", head: true })
      .eq("email", normalized)
      .eq("kind", "verify_failed")
      .gte("created_at", since);

    await logAudit({
      event: "auth.login_failed",
      tenantId: userCtx?.tenant_id ?? null,
      actorUserId: userCtx?.user_id ?? null,
      actorEmail: normalized,
      metadata: { reason: error?.message ?? "no_session" },
    });

    if ((count ?? 0) >= MAX_FAILED_VERIFIES && userCtx) {
      const suspendUntil = new Date(
        Date.now() + SUSPEND_MINUTES * 60 * 1000,
      ).toISOString();
      await admin
        .from("users")
        .update({ suspended_until: suspendUntil })
        .eq("id", userCtx.user_id);
      await logAudit({
        event: "auth.account_suspended",
        tenantId: userCtx.tenant_id,
        actorUserId: userCtx.user_id,
        actorEmail: normalized,
        metadata: { minutes: SUSPEND_MINUTES },
      });
      return {
        ok: false,
        error: `Feil kode. Kontoen er nå midlertidig sperret i ${SUSPEND_MINUTES} minutter.`,
      };
    }

    return { ok: false, error: "Feil kode. Prøv igjen." };
  }

  await recordAttempt(admin, normalized, slug, "verify_succeeded", true);

  // Hent role fra session-claims
  const { data: userData } = await supabase.auth.getUser();
  const claims = (userData.user?.app_metadata ?? {}) as Record<string, unknown>;
  // Access token hook legger role inn som custom claim — men app_metadata
  // har det ikke. Vi må hente fra public.users via admin.
  const { data: appUser } = await admin
    .from("users")
    .select("id, tenant_id, role")
    .eq("auth_user_id", userData.user?.id ?? "")
    .maybeSingle();

  await logAudit({
    event: "auth.login_succeeded",
    tenantId: appUser?.tenant_id ?? null,
    actorUserId: appUser?.id ?? null,
    actorEmail: normalized,
    metadata: { role: appUser?.role },
  });

  const role = appUser?.role ?? claims.user_role;
  const redirectTo = role === "admin" ? "/admin" : "/min-side";
  return { ok: true, redirectTo };
}

export async function resendOtp(
  slug: string,
  email: string,
): Promise<SendOtpResult> {
  // Akkurat samme flow som sendOtp — rate-limitedes likt.
  return sendOtp(slug, email);
}

export async function completeLoginRedirect(redirectTo: string): Promise<never> {
  redirect(redirectTo);
}

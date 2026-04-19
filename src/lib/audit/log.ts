import "server-only";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/types/database";

export type AuditEvent =
  | "auth.otp_requested"
  | "auth.login_succeeded"
  | "auth.login_failed"
  | "auth.account_suspended"
  | "auth.logout";

type LogInput = {
  event: AuditEvent;
  tenantId?: string | null;
  actorUserId?: string | null;
  actorEmail?: string | null;
  metadata?: Record<string, unknown>;
};

/**
 * Henter de tre første oktettene av en IPv4-adresse, eller de tre
 * første hex-gruppene for IPv6. Brukes til audit-logging uten å
 * lagre hele IP-en (GDPR-reduksjon).
 */
function ipPrefix(ip: string | null): string | null {
  if (!ip) return null;
  if (ip.includes(":")) {
    return ip.split(":").slice(0, 3).join(":");
  }
  return ip.split(".").slice(0, 3).join(".");
}

function shortenUA(ua: string | null): string | null {
  if (!ua) return null;
  // Forenklet: finn første browser + os i parenteser
  const browserMatch = ua.match(/(Chrome|Firefox|Safari|Edge)\/[\d.]+/);
  const osMatch = ua.match(/\(([^)]+)\)/);
  const browser = browserMatch?.[0] ?? "Unknown";
  const os = osMatch?.[1]?.split(";")[0]?.trim() ?? "";
  return [browser, os].filter(Boolean).join(" / ").slice(0, 120);
}

export async function logAudit(input: LogInput): Promise<void> {
  try {
    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      h.get("x-real-ip") ??
      null;
    const ua = h.get("user-agent");

    const admin = createAdminClient();
    const { error } = await admin.from("audit_log").insert({
      tenant_id: input.tenantId ?? null,
      actor_user_id: input.actorUserId ?? null,
      actor_email_snapshot: input.actorEmail ?? null,
      action: input.event,
      metadata: (input.metadata ?? {}) as Json,
      ip_prefix: ipPrefix(ip),
      user_agent_short: shortenUA(ua),
    });

    if (error) {
      // Aldri blokker bruker-flow pga audit-feil; logg til server-konsoll.
      console.error("Audit log write failed:", error.message);
    }
  } catch (err) {
    console.error("Audit log threw:", err);
  }
}

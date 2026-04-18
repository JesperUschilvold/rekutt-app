import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROOT_DOMAIN = process.env.ROOT_DOMAIN ?? "rekutt.no";

// Reserverte subdomener — disse blir aldri tolket som tenants.
const RESERVED = new Set(["www", "app", "api", "admin"]);

/**
 * Multi-tenant subdomene-routing.
 *
 *   sollihogda.rekutt.no/foo      →  /tenant/sollihogda/foo  (rewrite, skjult for bruker)
 *   sollihogda.localhost:3000/foo →  /tenant/sollihogda/foo
 *   rekutt.no/foo                 →  /foo                    (offentlig landing)
 *
 * Direkte tilgang til /tenant/* fra rot-domenet returnerer 404 — det
 * er en intern path som kun nås via subdomene-rewrite.
 */
export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") ?? "";
  const hostname = host.split(":")[0];

  let slug: string | null = null;

  if (hostname.endsWith("." + ROOT_DOMAIN)) {
    slug = hostname.slice(0, -("." + ROOT_DOMAIN).length);
  } else if (hostname.endsWith(".localhost")) {
    slug = hostname.slice(0, -".localhost".length);
  }

  if (slug && RESERVED.has(slug)) slug = null;
  // Subdomener kan ikke ha punktum (ingen sub-sub-domener støttes).
  if (slug && slug.includes(".")) slug = null;

  // Blokker direkte tilgang til /tenant/* uten subdomene.
  if (!slug && url.pathname.startsWith("/tenant/")) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (slug) {
    url.pathname = `/tenant/${slug}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Matcher alle paths unntatt Next-interne, statiske filer og favicon.
    "/((?!_next/|favicon.ico|.*\\..*).*)",
  ],
};

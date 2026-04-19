import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const ROOT_DOMAIN = process.env.ROOT_DOMAIN ?? "rekutt.no";
const RESERVED = new Set(["www", "app", "api", "admin"]);
const PROTECTED_PREFIXES = ["/admin", "/min-side"];

/**
 * Multi-tenant subdomene-routing + auth-refresh + basic route-protection.
 *
 *   sollihogda.rekutt.no/foo      →  /tenant/sollihogda/foo   (rewrite)
 *   sollihogda.localhost:3000/foo →  /tenant/sollihogda/foo
 *   rekutt.no/foo                 →  /foo                     (offentlig landing)
 *
 * /admin og /min-side krever innlogging — ellers redirect til /login.
 * Role-sjekk (admin vs ansatt) håndteres i selve siden.
 */
export async function proxy(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const hostname = host.split(":")[0];

  // ---- 1) Finn slug fra hostname ----
  let slug: string | null = null;
  if (hostname.endsWith("." + ROOT_DOMAIN)) {
    slug = hostname.slice(0, -("." + ROOT_DOMAIN).length);
  } else if (hostname.endsWith(".localhost")) {
    slug = hostname.slice(0, -".localhost".length);
  }
  if (slug && RESERVED.has(slug)) slug = null;
  if (slug && slug.includes(".")) slug = null;

  // ---- 2) Blokker direkte tilgang til /tenant/* fra rot-domenet ----
  if (!slug && req.nextUrl.pathname.startsWith("/tenant/")) {
    return new NextResponse("Not found", { status: 404 });
  }

  // ---- 3) Refresh Supabase-sesjonen ----
  // response oppdateres av setAll-kallbacken nedenfor hvis cookies endres.
  let response = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value),
          );
          response = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ---- 4) Auth-redirect ved beskyttede paths ----
  if (slug) {
    const needsAuth = PROTECTED_PREFIXES.some((p) =>
      req.nextUrl.pathname.startsWith(p),
    );
    if (needsAuth && !user) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  // ---- 5) Rewrite til tenant-rute hvis subdomene er satt ----
  if (slug) {
    const url = req.nextUrl.clone();
    url.pathname = `/tenant/${slug}${url.pathname}`;
    const rewritten = NextResponse.rewrite(url, { request: req });
    // Overfør cookies satt under refresh
    response.cookies.getAll().forEach((c) => rewritten.cookies.set(c));
    return rewritten;
  }

  return response;
}

export const config = {
  matcher: [
    // Matcher alle paths unntatt Next-interne, API-ruter, statiske filer og favicon.
    "/((?!_next/|api/|favicon.ico|.*\\..*).*)",
  ],
};

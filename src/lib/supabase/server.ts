import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * Server-klient for Supabase. Bruk i Server Components, Route Handlers
 * og Server Actions. Synkroniserer auth-cookies via next/headers.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll kan kalles fra en Server Component — der er det ikke
            // mulig å sette cookies. Det er trygt å ignorere så lenge
            // middleware refresher session.
          }
        },
      },
    },
  );
}

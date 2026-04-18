import Link from "next/link";
import { notFound } from "next/navigation";
import { getTenantBySlug } from "@/lib/tenant/get-tenant";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tenant = await getTenantBySlug(slug);
  return {
    title: tenant ? `${tenant.name} — Rekutt` : "Rekutt",
  };
}

export default async function TenantHome({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-3xl font-bold text-primary md:text-5xl">
          Velkommen til {tenant.name}
        </h1>
        <p className="mt-4 max-w-md text-text-secondary">
          Logg inn for å starte opplæringen din.
        </p>
        <Link
          href="/login"
          className="mt-8 rounded-md bg-accent px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-accent-hover"
        >
          Logg inn
        </Link>
      </main>
      <footer className="border-t border-border bg-surface px-6 py-6 text-center text-sm text-text-muted">
        Drevet av Rekutt
      </footer>
    </div>
  );
}

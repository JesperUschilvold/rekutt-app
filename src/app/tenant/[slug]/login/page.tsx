import { notFound } from "next/navigation";
import { getTenantBySlug } from "@/lib/tenant/get-tenant";
import { LoginForm } from "./LoginForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tenant = await getTenantBySlug(slug);
  return { title: tenant ? `Logg inn — ${tenant.name}` : "Logg inn" };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-sm">
          <p className="text-sm text-text-muted">{tenant.name}</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-primary">
            Logg inn
          </h1>
          <LoginForm slug={slug} tenantName={tenant.name} />
        </div>
      </main>
      <footer className="border-t border-border bg-surface px-6 py-6 text-center text-sm text-text-muted">
        Drevet av Rekutt
      </footer>
    </div>
  );
}

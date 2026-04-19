import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getTenantBySlug } from "@/lib/tenant/get-tenant";
import { getCurrentAppUser } from "@/lib/auth/current-user";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function MinSide({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const appUser = await getCurrentAppUser(slug);
  if (!appUser) redirect("/login");
  if (appUser.role !== "ansatt") redirect("/admin");

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-[1080px] items-center justify-between px-6">
          <div>
            <p className="text-xs text-text-muted">{tenant.name}</p>
            <p className="font-display text-lg font-semibold text-primary">
              Min side
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-text-secondary">
              {appUser.name ?? appUser.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[720px] flex-1 px-6 py-12">
        <h1 className="font-display text-3xl font-bold text-primary">
          Hei {appUser.name?.split(" ")[0] ?? ""} 👋
        </h1>
        <p className="mt-2 text-text-secondary">
          Placeholder — din opplæring vises her fra leveranse 05.
        </p>

        <div className="mt-8 rounded-lg border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-semibold text-primary">
            Innlogget
          </h2>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-text-muted">Navn</dt>
            <dd className="text-text-primary">{appUser.name ?? "—"}</dd>
            <dt className="text-text-muted">E-post</dt>
            <dd className="text-text-primary">{appUser.email}</dd>
            <dt className="text-text-muted">Rolle</dt>
            <dd className="text-text-primary">{appUser.role}</dd>
          </dl>
        </div>

        <Link
          href="/"
          className="mt-6 inline-block text-sm text-accent hover:text-accent-hover"
        >
          ← Til velkomstsiden
        </Link>
      </main>
    </div>
  );
}

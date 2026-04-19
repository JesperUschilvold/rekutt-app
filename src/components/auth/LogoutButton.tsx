"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:border-primary disabled:opacity-60"
    >
      {isPending ? "..." : "Logg ut"}
    </button>
  );
}

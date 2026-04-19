"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { sendOtp, verifyOtp, resendOtp } from "./actions";

type Step = "email" | "code";

export function LoginForm({ slug }: { slug: string; tenantName: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmitEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    startTransition(async () => {
      const result = await sendOtp(slug, email);
      if (result.ok) {
        setEmail(result.email);
        setStep("code");
      } else {
        setError(result.error);
      }
    });
  }

  function handleSubmitCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    startTransition(async () => {
      const result = await verifyOtp(slug, email, code);
      if (result.ok) {
        router.push(result.redirectTo);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  function handleResend() {
    setError(null);
    setInfo(null);
    startTransition(async () => {
      const result = await resendOtp(slug, email);
      if (result.ok) {
        setInfo("Ny kode sendt.");
      } else {
        setError(result.error);
      }
    });
  }

  if (step === "email") {
    return (
      <form onSubmit={handleSubmitEmail} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-text-primary">E-post</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-base text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="navn@arbeidsgiver.no"
          />
        </label>

        {error && (
          <p className="rounded-md bg-warning/10 px-3 py-2 text-sm text-warning">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || !email}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-base font-semibold text-white transition-colors hover:bg-primary-light disabled:opacity-60"
        >
          {isPending ? "Sender..." : "Send kode"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmitCode} className="mt-6 space-y-4">
      <p className="text-sm text-text-secondary">
        Sjekk e-posten din. Vi sendte en 6-sifret kode til{" "}
        <span className="font-medium text-text-primary">{email}</span>.
      </p>

      <label className="block">
        <span className="text-sm font-medium text-text-primary">Kode</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          autoComplete="one-time-code"
          required
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-center font-mono text-2xl tracking-[0.5em] text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="000000"
        />
      </label>

      {error && (
        <p className="rounded-md bg-warning/10 px-3 py-2 text-sm text-warning">
          {error}
        </p>
      )}
      {info && (
        <p className="rounded-md bg-success/10 px-3 py-2 text-sm text-success">
          {info}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || code.length !== 6}
        className="w-full rounded-md bg-primary px-4 py-2.5 text-base font-semibold text-white transition-colors hover:bg-primary-light disabled:opacity-60"
      >
        {isPending ? "Logger inn..." : "Logg inn"}
      </button>

      <button
        type="button"
        onClick={handleResend}
        disabled={isPending}
        className="w-full text-sm text-accent hover:text-accent-hover disabled:opacity-60"
      >
        Send ny kode
      </button>

      <button
        type="button"
        onClick={() => {
          setStep("email");
          setCode("");
          setError(null);
          setInfo(null);
        }}
        className="block w-full text-center text-sm text-text-muted hover:text-text-primary"
      >
        ← Bruk en annen e-post
      </button>
    </form>
  );
}

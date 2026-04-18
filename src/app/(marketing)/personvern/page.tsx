import Link from "next/link";

export const metadata = {
  title: "Personvern — Rekutt",
};

export default function PersonvernPage() {
  return (
    <main className="mx-auto max-w-[720px] px-6 py-20">
      <Link href="/" className="text-sm text-text-secondary hover:text-primary">
        ← Tilbake
      </Link>
      <h1 className="mt-6 font-display text-4xl font-bold text-primary">
        Personvernerklæring
      </h1>
      <p className="mt-6 text-text-secondary">
        Personvernerklæringen er under utarbeidelse og publiseres i forbindelse med
        leveranse 09 (GDPR-operasjoner). Inntil videre, ta kontakt på{" "}
        <a
          href="mailto:jesper.schilvold@gmail.com"
          className="text-accent hover:text-accent-hover"
        >
          jesper.schilvold@gmail.com
        </a>{" "}
        for spørsmål om databehandling.
      </p>
    </main>
  );
}

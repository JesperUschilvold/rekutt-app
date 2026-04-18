export default function TenantNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
      <h1 className="font-display text-3xl font-bold text-primary md:text-4xl">
        Denne adressen finnes ikke
      </h1>
      <p className="mt-4 max-w-md text-text-secondary">
        Sjekk at adressen er riktig, eller kontakt arbeidsgiveren din.
      </p>
      <a
        href="https://rekutt.no"
        className="mt-8 text-accent hover:text-accent-hover"
      >
        rekutt.no
      </a>
    </main>
  );
}

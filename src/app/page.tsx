export default function Home() {
  return (
    <main className="flex flex-1 min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1
        className="font-display font-semibold tracking-tight text-primary"
        style={{ fontSize: "64px", lineHeight: 1.1 }}
      >
        Rekutt
      </h1>
      <p
        className="mt-6 text-text-secondary"
        style={{ fontSize: "22px", lineHeight: 1.4 }}
      >
        Onboarding som faktisk fungerer.
      </p>
      <a
        href="mailto:jesper.schilvold@gmail.com"
        className="mt-10 text-accent hover:text-accent-hover transition-colors font-medium"
      >
        Kontakt oss
      </a>
    </main>
  );
}

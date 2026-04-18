import Link from "next/link";

const FAQ = [
  {
    q: "Vi har allerede et HR-system.",
    a: "De fleste HR-systemer håndterer lønn og personal — ikke strukturert opplæring med dokumentert gjennomføring per rutine. Rekutt utfyller, og integreres der det gir mening.",
  },
  {
    q: "Det virker dyrt for noen få ansettelser i året.",
    a: "Prising skalerer med antall aktive onboarding-løp. Har dere fem nyansatte i måneden, betaler dere deretter. Har dere én, betaler dere tilsvarende.",
  },
  {
    q: "Vi har ikke tid til å sette opp et nytt system.",
    a: "Derfor gjør vi oppsettet sammen med dere i løpet av to uker. Dere leverer rutinene — vi bygger løpet.",
  },
  {
    q: "Hva skjer med dataene våre?",
    a: "De er deres. Hostet i Norge, dokumentert med databehandleravtale, eksporterbart når som helst.",
  },
];

const PILLARS = [
  {
    title: "Forberedte vikarer",
    body: "Rolletilpassede løp gjør at hver ny medarbeider vet hva som forventes — fra første vakt.",
  },
  {
    title: "Dokumentert opplæring",
    body: "Gjennomføring lagres automatisk per ansatt og rutine. Tilsynsklar rapport på ett klikk.",
  },
  {
    title: "Rask utrulling",
    body: "Vi setter opp Rekutt sammen med dere på to uker. Deres rutiner, deres maler.",
  },
];

const STEPS = [
  { n: "1", title: "Invitér", body: "Last opp ansattliste eller invitér enkeltvis. Brukerne får tilgang via en sikker e-postlenke." },
  { n: "2", title: "Opplæring", body: "Hver vikar går gjennom modulene som gjelder dem. Påminnelser sendes automatisk." },
  { n: "3", title: "Klar til vakt", body: "Leder ser i sanntid hvem som har dokumentert kompetansen og er klar." },
];

export default function MarketingPage() {
  return (
    <div className="bg-bg text-text-primary">
      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-[1080px] items-center justify-between px-6">
          <Link href="/" className="font-display text-xl font-bold text-primary">
            Rekutt
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#hvordan" className="text-sm text-text-secondary hover:text-primary">
              Hvordan
            </a>
            <a href="#produkt" className="text-sm text-text-secondary hover:text-primary">
              Produkt
            </a>
            <a href="#kontakt" className="text-sm text-text-secondary hover:text-primary">
              Kontakt
            </a>
          </div>
          <Link
            href="/login"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-light"
          >
            Logg inn
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="mx-auto max-w-[1080px] text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-primary md:text-6xl">
            Tilsynsklar onboarding — fra dag én.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary md:text-xl">
            Rekutt sørger for at alle nye medarbeidere er dokumentert opplært før de går
            sin første vakt. Politiattest, HPR, medikamenthåndtering og internopplæring —
            samlet på ett sted, klart for Statsforvalteren.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="mailto:jesper.schilvold@gmail.com?subject=Demo%20av%20Rekutt"
              className="rounded-md bg-accent px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-accent-hover"
            >
              Bestill en demo
            </a>
            <a
              href="#pilot"
              className="rounded-md border border-border bg-surface px-6 py-3 text-base font-semibold text-primary transition-colors hover:border-primary"
            >
              Se pilot-detaljer
            </a>
          </div>
          {/* Trust-ribbon */}
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-3 text-sm text-text-secondary sm:grid-cols-3">
            <div>Hostet i Norge</div>
            <div>Tilsynsklar dokumentasjon</div>
            <div>Oppsett på 2 uker</div>
          </div>
        </div>
      </section>

      {/* Pilarer */}
      <section id="produkt" className="border-t border-border bg-primary-bg px-6 py-20">
        <div className="mx-auto max-w-[1080px]">
          <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">
            Tre ting Rekutt løser for deg
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="rounded-lg border border-border bg-surface p-6 shadow-sm"
              >
                <h3 className="font-display text-xl font-semibold text-primary">
                  {p.title}
                </h3>
                <p className="mt-3 text-text-secondary">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hvordan det fungerer */}
      <section id="hvordan" className="px-6 py-20">
        <div className="mx-auto max-w-[1080px]">
          <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">
            Slik fungerer det
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-display text-lg font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-primary">
                  {s.title}
                </h3>
                <p className="mt-2 text-text-secondary">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-primary-bg px-6 py-20">
        <div className="mx-auto max-w-[1080px]">
          <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">
            Vanlige innvendinger
          </h2>
          <dl className="mt-10 space-y-6">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-lg border border-border bg-surface p-6"
              >
                <dt className="font-display text-lg font-semibold text-primary">
                  {item.q}
                </dt>
                <dd className="mt-2 text-text-secondary">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Kontakt */}
      <section id="kontakt" className="px-6 py-24">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">
            La oss ta en prat om onboarding hos dere.
          </h2>
          <p className="mt-4 text-text-secondary">
            Vi tar kontakt innen én arbeidsdag for en uforpliktende samtale om hvordan
            Rekutt kan tilpasses deres rutiner og krav.
          </p>
          <a
            href="mailto:jesper.schilvold@gmail.com?subject=Demo%20av%20Rekutt"
            className="mt-8 inline-block rounded-md bg-accent px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-accent-hover"
          >
            jesper.schilvold@gmail.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface px-6 py-10">
        <div className="mx-auto flex max-w-[1080px] flex-col items-center justify-between gap-4 text-sm text-text-muted md:flex-row">
          <div>© {new Date().getFullYear()} Rekutt</div>
          <div className="flex gap-6">
            <Link href="/personvern" className="hover:text-primary">
              Personvern
            </Link>
            <Link href="/personvern#cookies" className="hover:text-primary">
              Cookies
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

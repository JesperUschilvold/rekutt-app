# Rekutt

Onboarding-plattform for serveringsbransjen. Strukturerer opplæring av nyansatte slik at de kan stå i sin første vakt med trygghet, og gir leder oversikt over hvem som er klar.

Dette repoet inneholder web-applikasjonen (Next.js + Supabase). Bygges sekvensielt etter leveranseplanen i `Leveranser/`-mappen i den overordnede Rekutt-mappen.

## Kjøre lokalt

Krever Node 20+.

```bash
npm install
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000).

## Skript

- `npm run dev` — utviklingsserver med hot reload
- `npm run build` — produksjonsbuild
- `npm run start` — kjør produksjonsbuild
- `npm run lint` — ESLint

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (designtokens i `src/app/globals.css` `@theme`-blokken)
- DM Sans + Plus Jakarta Sans via `next/font/google`
- Supabase (kommer i leveranse 02)
- Resend (kommer i leveranse 08)
- Hostes på Vercel

## Miljøvariabler

Kopier `.env.example` til `.env.local` og fyll inn verdier etter hvert som de tas i bruk:

```bash
cp .env.example .env.local
```

## Arkitektur

Full arkitektur, datamodell, RLS og GDPR-håndtering beskrives i `Rekutt - Teknisk arkitektur og datahaandtering.docx` i felles Rekutt-mappe.

## Designtokens

Farger og fonter er låst på tvers av leveranser. Se `@theme`-blokken i [src/app/globals.css](src/app/globals.css). Bruk Tailwind-klassene `bg-primary`, `text-accent`, `font-display` osv.

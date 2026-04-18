// Passthrough-layout for tenant-scope. Selve tenant-oppslaget gjøres
// i page.tsx (eller fremtidige sub-pages) for at notFound() skal kunne
// finne not-found.tsx i samme segment.
export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

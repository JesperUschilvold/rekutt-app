-- =========================================================
-- Rate limiting av OTP-forespørsler og feilforsøk
-- =========================================================
create table auth_attempts (
  id          uuid primary key default uuid_generate_v4(),
  email       text not null,
  ip_prefix   text,
  tenant_slug text,
  kind        text not null,   -- 'otp_requested' | 'verify_succeeded' | 'verify_failed'
  success     boolean,
  created_at  timestamptz default now()
);

create index idx_auth_attempts_email on auth_attempts(email, created_at);
create index idx_auth_attempts_tenant on auth_attempts(tenant_slug, created_at);

alter table auth_attempts enable row level security;
-- Ingen policy opprettes — bare service_role kan skrive/lese, som ønsket.

-- =========================================================
-- Suspenderings-felt for konto (etter for mange feilforsøk)
-- =========================================================
alter table users add column if not exists suspended_until timestamptz;

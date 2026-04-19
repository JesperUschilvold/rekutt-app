-- =========================================================
-- Leveranse 05a — Schema-utvidelser etter pivoten
--
-- Følger Strategi-oppdatering.md:
--   * Tredje rolle: `veileder`
--   * Nye tabeller: risk_areas (Rekutt-eid taksonomi), procedures, sign_offs
--   * Utvider modules med risk_area_id + requires_sign_off
--   * Utvider onboarding_tracks med is_default
-- =========================================================

-- ---------------------------------------------------------
-- 1) Ny rolle i user_role-enumen.
--    OBS: verdien kan ikke brukes i samme transaksjon den
--    legges til, men vi refererer den ikke her — det er greit.
-- ---------------------------------------------------------
alter type user_role add value if not exists 'veileder' before 'ansatt';

-- ---------------------------------------------------------
-- 2) risk_areas — delt taksonomi levert av Rekutt (ikke tenant-spesifikk)
-- ---------------------------------------------------------
create table risk_areas (
  id           uuid primary key default uuid_generate_v4(),
  slug         text unique not null,
  name         text not null,
  description  text,
  order_index  int default 0,
  created_at   timestamptz default now()
);

alter table risk_areas enable row level security;

-- Alle innloggede kan lese; ingen offentlige writes (kun service_role).
create policy risk_areas_select_all on risk_areas
  for select using (true);

-- Seed de 8 risikoområdene fra strategi-doket.
insert into risk_areas (slug, name, description, order_index) values
  ('observasjon',          'Observasjon og eskalering',           'Gjenkjenne endring i allmenntilstand og vite når sykepleier skal varsles.', 1),
  ('legemiddelhandtering', 'Legemiddelhåndtering',                'Regler og roller rundt dosetter, signatur og hva assistenter kan/ikke kan.', 2),
  ('dokumentasjon',        'Dokumentasjon',                       'Hva som skal dokumenteres hvor, og hvorfor.',                              3),
  ('demenskommunikasjon',  'Demenskommunikasjon',                 'Tilnærming og kommunikasjonsteknikker for beboere med kognitiv svikt.',   4),
  ('ernaring',             'Ernæring',                            'Kost, væskeregistrering, svelgeproblemer, risiko for underernæring.',      5),
  ('parorende',            'Kommunikasjon med pårørende',         'Taushetsplikt, grensesetting, involvering, eskalering ved konflikt.',      6),
  ('smittevern',           'Smittevern',                          'Håndhygiene, isolasjon, PPE, meldeplikt.',                                 7),
  ('forflytning',          'Forflytning',                         'Trygge løfteteknikker, hjelpemidler, når man skal være to.',               8);

-- ---------------------------------------------------------
-- 3) procedures — tenant-eid offisiell fremgangsmåte m/versjonering
-- ---------------------------------------------------------
create table procedures (
  id             uuid primary key default uuid_generate_v4(),
  tenant_id      uuid not null references tenants(id) on delete cascade,
  risk_area_id   uuid references risk_areas(id),
  title          text not null,
  body_md        text,
  version        int  not null default 1,
  is_current     boolean not null default true,
  supersedes_id  uuid references procedures(id),
  archived_at    timestamptz,
  created_by     uuid references users(id),
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create index idx_procedures_tenant on procedures(tenant_id) where archived_at is null;
create index idx_procedures_risk on procedures(risk_area_id);
create index idx_procedures_current on procedures(tenant_id, is_current) where is_current = true;

alter table procedures enable row level security;

create policy procedures_tenant on procedures
  for all using (tenant_id = public.jwt_tenant_id());

-- ---------------------------------------------------------
-- 4) sign_offs — veileders bekreftelse på praktisk ferdighet
-- ---------------------------------------------------------
create table sign_offs (
  id                uuid primary key default uuid_generate_v4(),
  tenant_id         uuid not null references tenants(id) on delete cascade,
  user_id           uuid not null references users(id) on delete cascade,       -- ansatt som ble signert av
  module_id         uuid not null references modules(id) on delete cascade,     -- scenariokortet
  signed_by         uuid references users(id) on delete set null,               -- veileder
  signer_email_snap text,                                                        -- bevarer e-post selv om veileder slettes
  note              text,
  signed_at         timestamptz default now(),
  unique (user_id, module_id)
);

create index idx_signoffs_user on sign_offs(user_id);
create index idx_signoffs_tenant on sign_offs(tenant_id);

alter table sign_offs enable row level security;

create policy signoffs_tenant on sign_offs
  for all using (tenant_id = public.jwt_tenant_id());

-- ---------------------------------------------------------
-- 5) Utvidelser på modules (scenariokort) og onboarding_tracks
-- ---------------------------------------------------------
alter table modules
  add column if not exists risk_area_id      uuid references risk_areas(id),
  add column if not exists requires_sign_off boolean not null default false;

create index if not exists idx_modules_risk on modules(risk_area_id);

alter table onboarding_tracks
  add column if not exists is_default boolean not null default false;

-- Maks én default-track per tenant.
create unique index if not exists uniq_default_track_per_tenant
  on onboarding_tracks(tenant_id)
  where is_default = true;

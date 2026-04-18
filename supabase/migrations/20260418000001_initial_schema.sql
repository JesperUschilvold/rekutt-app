-- =========================================================
-- Rekutt — Initial schema
-- =========================================================

-- UUID extension
create extension if not exists "uuid-ossp";

-- =========================================================
-- 1. Tenants
-- =========================================================
create table tenants (
  id                    uuid primary key default uuid_generate_v4(),
  slug                  text unique not null,
  name                  text not null,
  org_nummer            text,
  billing_email         text,
  phone                 text,
  address               text,
  plan                  text default 'trial',
  data_retention_months int  default 13,
  created_at            timestamptz default now(),
  deleted_at            timestamptz
);

create index idx_tenants_slug on tenants(slug) where deleted_at is null;

-- =========================================================
-- 2. Users (admin og ansatte)
-- =========================================================
create type user_role   as enum ('admin', 'ansatt');
create type user_status as enum ('invited', 'active', 'suspended', 'deleted_soft');

create table users (
  id                    uuid primary key default uuid_generate_v4(),
  tenant_id             uuid not null references tenants(id) on delete cascade,
  auth_user_id          uuid unique,        -- kobling til auth.users
  email                 text not null,
  name                  text,
  phone                 text,
  role                  user_role not null default 'ansatt',
  department            text,
  start_date            date,
  end_date              date,
  status                user_status default 'invited',
  invited_by            uuid references users(id),
  last_active_at        timestamptz,
  scheduled_deletion_at timestamptz,
  deleted_at            timestamptz,
  created_at            timestamptz default now(),
  unique (tenant_id, email)
);

create index idx_users_tenant on users(tenant_id) where deleted_at is null;
create index idx_users_auth on users(auth_user_id);

-- =========================================================
-- 3. Modules (delt innhold, ikke tenant-spesifikt)
-- =========================================================
create type module_phase   as enum ('for_forste_vakt', 'forste_uke', 'fortlopende');
create type section_kind   as enum ('intro', 'content', 'scenario', 'quiz', 'reflection');

create table modules (
  id           uuid primary key default uuid_generate_v4(),
  slug         text unique not null,
  title        text not null,
  goal         text,
  phase        module_phase not null,
  order_index  int default 0,
  duration_min int,
  version      int default 1,
  published    boolean default false,
  content      jsonb default '{}'::jsonb,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create table module_sections (
  id          uuid primary key default uuid_generate_v4(),
  module_id   uuid not null references modules(id) on delete cascade,
  order_index int not null,
  title       text not null,
  kind        section_kind not null,
  is_required boolean default true,
  content     jsonb default '{}'::jsonb,
  created_at  timestamptz default now()
);

create index idx_sections_module on module_sections(module_id);

-- =========================================================
-- 4. Tenant-overstyringer av moduler
-- =========================================================
create table tenant_module_customizations (
  tenant_id   uuid not null references tenants(id) on delete cascade,
  module_id   uuid not null references modules(id) on delete cascade,
  is_enabled  boolean default true,
  overrides   jsonb default '{}'::jsonb,
  created_at  timestamptz default now(),
  primary key (tenant_id, module_id)
);

-- =========================================================
-- 5. Tracks og tildelinger
-- =========================================================
create table onboarding_tracks (
  id          uuid primary key default uuid_generate_v4(),
  tenant_id   uuid not null references tenants(id) on delete cascade,
  name        text not null,
  role_target text,
  created_at  timestamptz default now()
);

create table track_modules (
  track_id    uuid not null references onboarding_tracks(id) on delete cascade,
  module_id   uuid not null references modules(id) on delete cascade,
  order_index int not null,
  is_required boolean default true,
  primary key (track_id, module_id)
);

create table user_tracks (
  id             uuid primary key default uuid_generate_v4(),
  tenant_id      uuid not null references tenants(id) on delete cascade,
  user_id        uuid not null references users(id) on delete cascade,
  track_id       uuid not null references onboarding_tracks(id) on delete cascade,
  assigned_at    timestamptz default now(),
  started_at     timestamptz,
  completed_at   timestamptz,
  due_date       date,
  ready_for_duty boolean default false,
  unique (user_id, track_id)
);

-- =========================================================
-- 6. Section completions — kjernen i progresjonssporingen
-- =========================================================
create table section_completions (
  id            uuid primary key default uuid_generate_v4(),
  tenant_id     uuid not null references tenants(id) on delete cascade,
  user_id       uuid not null references users(id) on delete cascade,
  module_id     uuid not null references modules(id) on delete cascade,
  section_id    uuid not null references module_sections(id) on delete cascade,
  passed        boolean not null default true,
  attempts      int default 1,
  completed_at  timestamptz default now(),
  unique (user_id, section_id)
);

create index idx_sc_user_module on section_completions(user_id, module_id);
create index idx_sc_tenant on section_completions(tenant_id);

-- =========================================================
-- 7. Reminders
-- =========================================================
create table reminders (
  id               uuid primary key default uuid_generate_v4(),
  tenant_id        uuid not null references tenants(id) on delete cascade,
  sent_to_user_id  uuid references users(id) on delete set null,
  sent_by          uuid references users(id) on delete set null,
  module_id        uuid references modules(id),
  subject          text,
  body             text,
  delivery_status  text default 'pending',  -- pending, sent, failed
  sent_at          timestamptz,
  body_purged_at   timestamptz,
  created_at       timestamptz default now()
);

-- =========================================================
-- 8. Audit log (INSERT-only via RLS)
-- =========================================================
create table audit_log (
  id                    uuid primary key default uuid_generate_v4(),
  tenant_id             uuid references tenants(id),
  actor_user_id         uuid references users(id) on delete set null,
  actor_email_snapshot  text,
  action                text not null,
  target_type           text,
  target_id             uuid,
  metadata              jsonb default '{}'::jsonb,
  ip_prefix             text,
  user_agent_short      text,
  created_at            timestamptz default now()
);

create index idx_audit_tenant on audit_log(tenant_id);
create index idx_audit_created on audit_log(created_at);

-- =========================================================
-- 9. Data deletion requests
-- =========================================================
create type deletion_status as enum ('scheduled', 'cancelled', 'executed');

create table data_deletion_requests (
  id              uuid primary key default uuid_generate_v4(),
  tenant_id       uuid not null references tenants(id) on delete cascade,
  target_user_id  uuid references users(id),
  requested_by    uuid references users(id),
  reason          text,
  requested_at    timestamptz default now(),
  scheduled_for   timestamptz not null,
  executed_at     timestamptz,
  status          deletion_status default 'scheduled'
);

-- =========================================================
-- 10. Subscriptions (forenklet for MVP)
-- =========================================================
create table subscriptions (
  tenant_id              uuid primary key references tenants(id) on delete cascade,
  stripe_customer_id     text,
  stripe_subscription_id text,
  plan                   text default 'trial',
  status                 text default 'trialing',
  active_seats           int  default 0,
  current_period_end     timestamptz,
  updated_at             timestamptz default now()
);

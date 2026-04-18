-- =========================================================
-- Hjelpefunksjoner: hent tenant-kontekst fra JWT
-- Plasseres i public-skjemaet siden Supabase ikke tillater
-- nye funksjoner i auth-skjemaet på hostede prosjekter.
-- Bruker auth.jwt() (Supabase-built-in) for å lese claims.
-- =========================================================
create or replace function public.jwt_tenant_id() returns uuid
language sql stable as $$
  select nullif(auth.jwt() ->> 'tenant_id', '')::uuid
$$;

create or replace function public.jwt_user_role() returns text
language sql stable as $$
  select coalesce(auth.jwt() ->> 'user_role', 'anon')
$$;

create or replace function public.jwt_app_user_id() returns uuid
language sql stable as $$
  select nullif(auth.jwt() ->> 'app_user_id', '')::uuid
$$;

-- =========================================================
-- Aktiver RLS på alle tenant-tabeller
-- =========================================================
alter table tenants                       enable row level security;
alter table users                         enable row level security;
alter table tenant_module_customizations  enable row level security;
alter table onboarding_tracks             enable row level security;
alter table track_modules                 enable row level security;
alter table user_tracks                   enable row level security;
alter table section_completions           enable row level security;
alter table reminders                     enable row level security;
alter table audit_log                     enable row level security;
alter table data_deletion_requests        enable row level security;
alter table subscriptions                 enable row level security;

-- Moduler og seksjoner er delt innhold — les-only for innloggede, write kun via service role
alter table modules         enable row level security;
alter table module_sections enable row level security;

-- =========================================================
-- Modules: alle autentiserte kan lese publiserte moduler
-- =========================================================
create policy modules_select_published on modules
  for select using (published = true);

create policy sections_select_all on module_sections
  for select using (
    exists (select 1 from modules m where m.id = module_sections.module_id and m.published)
  );

-- =========================================================
-- Tenants: admin ser sin egen
-- =========================================================
create policy tenants_select_own on tenants
  for select using (id = public.jwt_tenant_id());

-- =========================================================
-- Users-policy: alle ser sin tenant, ansatt ser seg selv + admin
-- =========================================================
create policy users_select_tenant on users
  for select using (
    tenant_id = public.jwt_tenant_id()
    and (
      public.jwt_user_role() = 'admin'
      or id = public.jwt_app_user_id()
    )
  );

create policy users_update_self on users
  for update using (id = public.jwt_app_user_id())
  with check (id = public.jwt_app_user_id());

create policy users_admin_modify on users
  for all using (
    tenant_id = public.jwt_tenant_id() and public.jwt_user_role() = 'admin'
  );

-- =========================================================
-- Section completions: ansatt ser kun sine egne, admin ser alle i tenant
-- =========================================================
create policy sc_select_self on section_completions
  for select using (
    tenant_id = public.jwt_tenant_id()
    and (public.jwt_user_role() = 'admin' or user_id = public.jwt_app_user_id())
  );

create policy sc_insert_self on section_completions
  for insert with check (
    tenant_id = public.jwt_tenant_id() and user_id = public.jwt_app_user_id()
  );

-- =========================================================
-- Audit log: INSERT-only, admin ser egne tenant-rader, ingen kan UPDATE/DELETE
-- =========================================================
create policy audit_insert_all on audit_log
  for insert with check (true);

create policy audit_select_admin on audit_log
  for select using (
    tenant_id = public.jwt_tenant_id() and public.jwt_user_role() = 'admin'
  );

-- =========================================================
-- Resten av tenant-tabellene følger samme mønster
-- =========================================================
create policy tracks_tenant on onboarding_tracks
  for all using (tenant_id = public.jwt_tenant_id());

create policy track_modules_tenant on track_modules
  for all using (
    exists (select 1 from onboarding_tracks t where t.id = track_id and t.tenant_id = public.jwt_tenant_id())
  );

create policy user_tracks_tenant on user_tracks
  for all using (tenant_id = public.jwt_tenant_id());

create policy reminders_tenant on reminders
  for all using (tenant_id = public.jwt_tenant_id());

create policy deletion_tenant on data_deletion_requests
  for all using (tenant_id = public.jwt_tenant_id());

create policy subscriptions_tenant on subscriptions
  for all using (tenant_id = public.jwt_tenant_id());

create policy customizations_tenant on tenant_module_customizations
  for all using (tenant_id = public.jwt_tenant_id());

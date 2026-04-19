-- =========================================================
-- Gi supabase_auth_admin tilgang til å lese public.users
-- fra innsiden av custom_access_token_hook.
-- Uten dette feiler hooken med 500 og hele login-flyten stopper.
-- =========================================================

grant usage on schema public to supabase_auth_admin;
grant select on public.users to supabase_auth_admin;

-- RLS-policy: auth-admin kan lese alle users (kun fra hook-kontekst)
create policy users_auth_admin_select on public.users
  as permissive
  for select
  to supabase_auth_admin
  using (true);

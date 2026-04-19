-- =========================================================
-- Custom Access Token Hook
-- Legger tenant_id, user_role og app_user_id som claims på JWT
-- slik at RLS-policyene fra 20260418000002 kan bruke dem.
-- Må aktiveres manuelt i Supabase Dashboard → Authentication → Hooks.
-- =========================================================
create or replace function public.custom_access_token_hook(event jsonb)
  returns jsonb
  language plpgsql stable
  set search_path = public, auth
  as $$
declare
  claims jsonb;
  u      public.users%rowtype;
begin
  claims := event->'claims';

  select * into u
    from public.users
   where auth_user_id = (event->>'user_id')::uuid
     and deleted_at is null
   limit 1;

  if u.id is not null then
    claims := jsonb_set(claims, '{tenant_id}',   to_jsonb(u.tenant_id));
    claims := jsonb_set(claims, '{user_role}',   to_jsonb(u.role::text));
    claims := jsonb_set(claims, '{app_user_id}', to_jsonb(u.id));
  end if;

  event := jsonb_set(event, '{claims}', claims);
  return event;
end;
$$;

grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;

-- Service-role må IKKE kunne kalle denne direkte — kun auth-systemet.
revoke execute on function public.custom_access_token_hook(jsonb) from authenticated, anon, public;

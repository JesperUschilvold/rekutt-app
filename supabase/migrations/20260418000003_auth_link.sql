-- =========================================================
-- Kobling mellom auth.users og public.users
-- =========================================================
create or replace function public.link_auth_user() returns trigger
language plpgsql security definer set search_path = public, auth as $$
begin
  update public.users
     set auth_user_id = new.id,
         status       = 'active'
   where lower(email) = lower(new.email)
     and auth_user_id is null;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.link_auth_user();

-- =========================================================
-- Funksjon for å hente tenant og rolle ved innlogging
-- =========================================================
create or replace function public.get_user_context(p_email text, p_tenant_slug text)
  returns table (
    user_id    uuid,
    tenant_id  uuid,
    role       user_role,
    status     user_status,
    full_name  text
  )
  language sql stable security definer set search_path = public as $$
  select u.id, u.tenant_id, u.role, u.status, u.name
    from public.users u
    join public.tenants t on t.id = u.tenant_id
   where lower(u.email) = lower(p_email)
     and t.slug = p_tenant_slug
     and u.deleted_at is null
     and t.deleted_at is null
  limit 1;
$$;

grant execute on function public.get_user_context(text, text) to anon, authenticated;

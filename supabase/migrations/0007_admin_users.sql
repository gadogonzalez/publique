-- Internal staff. One row per Supabase Auth user who is allowed into
-- /admin. Business self-service accounts (not in MVP scope) would be a
-- separate table later -- do not overload this one for that.
create table admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'superadmin')),
  created_at timestamptz not null default now()
);

-- Security-definer helper so RLS policies can check "is the current user an
-- admin" without recursively hitting RLS on admin_users itself.
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from admin_users where id = auth.uid()
  );
$$;

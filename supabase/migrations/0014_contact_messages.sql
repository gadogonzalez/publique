-- Messages sent from the public /contacto form. Anyone can submit (insert
-- only, always as status 'new'); only admins can read or update them.
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  phone text check (phone is null or char_length(phone) <= 40),
  reason text not null default 'consulta' check (reason in ('consulta', 'negocio', 'error')),
  message text not null check (char_length(message) between 1 and 2000),
  status text not null default 'new' check (status in ('new', 'read')),
  created_at timestamptz not null default now()
);

create index contact_messages_created_idx on contact_messages (created_at desc);

alter table contact_messages enable row level security;

create policy contact_messages_public_insert on contact_messages
  for insert with check (status = 'new');
create policy contact_messages_admin_read on contact_messages
  for select using (is_admin());
create policy contact_messages_admin_update on contact_messages
  for update using (is_admin()) with check (is_admin());
create policy contact_messages_admin_delete on contact_messages
  for delete using (is_admin());

grant insert on contact_messages to anon;
grant insert, select, update, delete on contact_messages to authenticated;

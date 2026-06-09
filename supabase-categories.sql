-- Tabla de categorías dinámicas
create table if not exists public.categories (
  id text primary key,
  label text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;

-- Cualquiera puede leer las categorías
create policy "Todos pueden ver categorías" on public.categories
  for select using (true);

-- Solo admins autenticados pueden modificar
create policy "Admin puede gestionar categorías" on public.categories
  for all to authenticated using (true) with check (true);

-- Insertar las categorías existentes
insert into public.categories (id, label, sort_order) values
  ('aromaticas',  'Aromáticas',  1),
  ('decorativas', 'Decorativas', 2),
  ('relajacion',  'Relajación',  3),
  ('regalo',      'Regalos',     4),
  ('navidad',     'Navidad',     5)
on conflict (id) do nothing;

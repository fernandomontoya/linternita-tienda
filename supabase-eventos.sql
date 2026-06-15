-- Catálogo de colores de listón
create table if not exists public.ribbon_colors (
  id text primary key,
  label text not null,
  hex text not null default '#C9A84C',
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table public.ribbon_colors enable row level security;

create policy "Todos pueden ver colores de liston" on public.ribbon_colors
  for select using (true);

create policy "Admin puede gestionar colores de liston" on public.ribbon_colors
  for all to authenticated using (true) with check (true);

insert into public.ribbon_colors (id, label, hex, sort_order) values
  ('dorado',   'Dorado',   '#C9A84C', 1),
  ('blanco',   'Blanco',   '#FFFFFF', 2),
  ('rosa',     'Rosa',     '#F2C4CE', 3),
  ('azul',     'Azul',     '#A7C7E7', 4),
  ('rojo',     'Rojo',     '#D64545', 5),
  ('verde',    'Verde',    '#8FBF8F', 6),
  ('morado',   'Morado',   '#B79CDB', 7),
  ('negro',    'Negro',    '#2C1810', 8)
on conflict (id) do nothing;

-- Catálogo de colores de tarjeta
create table if not exists public.card_colors (
  id text primary key,
  label text not null,
  hex text not null default '#FFFFFF',
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table public.card_colors enable row level security;

create policy "Todos pueden ver colores de tarjeta" on public.card_colors
  for select using (true);

create policy "Admin puede gestionar colores de tarjeta" on public.card_colors
  for all to authenticated using (true) with check (true);

insert into public.card_colors (id, label, hex, sort_order) values
  ('blanco',   'Blanco',   '#FFFFFF', 1),
  ('crema',    'Crema',    '#FAF7F2', 2),
  ('dorado',   'Dorado',   '#E8C97A', 3),
  ('rosa',     'Rosa',     '#F2C4CE', 4),
  ('azul',     'Azul',     '#A7C7E7', 5),
  ('verde',    'Verde',    '#8FBF8F', 6)
on conflict (id) do nothing;

-- Catálogo de aromas reutilizable
create table if not exists public.aromas (
  id text primary key,
  label text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table public.aromas enable row level security;

create policy "Todos pueden ver aromas" on public.aromas
  for select using (true);

create policy "Admin puede gestionar aromas" on public.aromas
  for all to authenticated using (true) with check (true);

-- Sembrar con los aromas ya usados en productos existentes
insert into public.aromas (id, label, sort_order)
select distinct
  lower(regexp_replace(unnest(aromas), '[^a-zA-Z0-9]+', '-', 'g')) as id,
  unnest(aromas) as label,
  0
from public.products
where aromas is not null
on conflict (id) do nothing;

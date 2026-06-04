create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number serial,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  customer_address text,
  items jsonb not null,
  total numeric(10,2) not null,
  status text default 'pendiente',
  payment_method text default 'pendiente',
  notes text,
  created_at timestamptz default now()
);

alter table public.orders enable row level security;

-- Solo admins autenticados pueden leer y modificar
create policy "Admin gestiona pedidos"
  on public.orders for all
  to authenticated
  using (true)
  with check (true);

-- Cualquier visitante puede crear un pedido (checkout)
create policy "Cualquiera puede crear pedido"
  on public.orders for insert
  with check (true);

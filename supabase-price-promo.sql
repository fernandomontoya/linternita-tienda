-- Agregar precio de promoción a productos
alter table public.products
  add column if not exists price_promo numeric(10,2) default null;

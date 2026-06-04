-- Permitir a usuarios autenticados (admin) hacer todo en productos
create policy "Admin puede gestionar productos"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

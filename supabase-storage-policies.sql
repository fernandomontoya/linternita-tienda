-- Cualquiera puede ver las imágenes (públicas)
create policy "Imágenes públicas"
  on storage.objects for select
  using ( bucket_id = 'products' );

-- Solo usuarios autenticados pueden subir/eliminar
create policy "Admin sube imágenes"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'products' );

create policy "Admin elimina imágenes"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'products' );

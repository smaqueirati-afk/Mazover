-- ============================================================================
-- MAZOVER · Supabase Storage (buckets de imágenes)
-- Ejecutar después de schema.sql (usa public.is_admin()).
-- ============================================================================

insert into storage.buckets (id, name, public) values
  ('products', 'products', true),
  ('content', 'content', true)
on conflict (id) do nothing;

-- Lectura pública de ambos buckets
drop policy if exists "storage public read" on storage.objects;
create policy "storage public read" on storage.objects
  for select using (bucket_id in ('products', 'content'));

-- Escritura/edición/borrado solo administradores
drop policy if exists "storage admin insert" on storage.objects;
create policy "storage admin insert" on storage.objects
  for insert with check (bucket_id in ('products', 'content') and public.is_admin());

drop policy if exists "storage admin update" on storage.objects;
create policy "storage admin update" on storage.objects
  for update using (bucket_id in ('products', 'content') and public.is_admin());

drop policy if exists "storage admin delete" on storage.objects;
create policy "storage admin delete" on storage.objects
  for delete using (bucket_id in ('products', 'content') and public.is_admin());

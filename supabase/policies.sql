-- ============================================================================
-- MAZOVER · Row Level Security
-- Visitante (anon): lee contenido/productos activos.
-- Admin (profiles.is_admin = true): CRUD total.
-- Ejecutar DESPUÉS de schema.sql.
-- ============================================================================

-- Habilitar RLS en todas las tablas
alter table public.profiles          enable row level security;
alter table public.settings          enable row level security;
alter table public.content_blocks    enable row level security;
alter table public.categories        enable row level security;
alter table public.fits              enable row level security;
alter table public.sizes             enable row level security;
alter table public.colors            enable row level security;
alter table public.collections       enable row level security;
alter table public.products          enable row level security;
alter table public.product_colors    enable row level security;
alter table public.product_variants  enable row level security;
alter table public.product_images    enable row level security;
alter table public.collection_products enable row level security;
alter table public.size_guides       enable row level security;
alter table public.instagram_reels   enable row level security;
alter table public.menus             enable row level security;
alter table public.menu_items        enable row level security;
alter table public.inquiries         enable row level security;

-- ---- profiles: cada uno ve/edita el suyo; admin ve todo ----
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles
  for select using (auth.uid() = id or public.is_admin());
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- ---- Helper macro (manual): lectura pública + escritura admin ----
-- settings: lectura pública (una fila), escritura admin
drop policy if exists settings_read on public.settings;
create policy settings_read on public.settings for select using (true);
drop policy if exists settings_write on public.settings;
create policy settings_write on public.settings for all
  using (public.is_admin()) with check (public.is_admin());

-- content_blocks
drop policy if exists content_read on public.content_blocks;
create policy content_read on public.content_blocks for select using (true);
drop policy if exists content_write on public.content_blocks;
create policy content_write on public.content_blocks for all
  using (public.is_admin()) with check (public.is_admin());

-- categories (públicas: solo activas; admin: todas)
drop policy if exists categories_read on public.categories;
create policy categories_read on public.categories for select
  using (is_active or public.is_admin());
drop policy if exists categories_write on public.categories;
create policy categories_write on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

-- fits
drop policy if exists fits_read on public.fits;
create policy fits_read on public.fits for select using (is_active or public.is_admin());
drop policy if exists fits_write on public.fits;
create policy fits_write on public.fits for all using (public.is_admin()) with check (public.is_admin());

-- sizes
drop policy if exists sizes_read on public.sizes;
create policy sizes_read on public.sizes for select using (is_active or public.is_admin());
drop policy if exists sizes_write on public.sizes;
create policy sizes_write on public.sizes for all using (public.is_admin()) with check (public.is_admin());

-- colors
drop policy if exists colors_read on public.colors;
create policy colors_read on public.colors for select using (is_active or public.is_admin());
drop policy if exists colors_write on public.colors;
create policy colors_write on public.colors for all using (public.is_admin()) with check (public.is_admin());

-- collections
drop policy if exists collections_read on public.collections;
create policy collections_read on public.collections for select using (is_active or public.is_admin());
drop policy if exists collections_write on public.collections;
create policy collections_write on public.collections for all using (public.is_admin()) with check (public.is_admin());

-- products
drop policy if exists products_read on public.products;
create policy products_read on public.products for select using (is_active or public.is_admin());
drop policy if exists products_write on public.products;
create policy products_write on public.products for all using (public.is_admin()) with check (public.is_admin());

-- product_colors
drop policy if exists product_colors_read on public.product_colors;
create policy product_colors_read on public.product_colors for select using (is_active or public.is_admin());
drop policy if exists product_colors_write on public.product_colors;
create policy product_colors_write on public.product_colors for all using (public.is_admin()) with check (public.is_admin());

-- product_variants
drop policy if exists variants_read on public.product_variants;
create policy variants_read on public.product_variants for select using (is_active or public.is_admin());
drop policy if exists variants_write on public.product_variants;
create policy variants_write on public.product_variants for all using (public.is_admin()) with check (public.is_admin());

-- product_images
drop policy if exists images_read on public.product_images;
create policy images_read on public.product_images for select using (true);
drop policy if exists images_write on public.product_images;
create policy images_write on public.product_images for all using (public.is_admin()) with check (public.is_admin());

-- collection_products
drop policy if exists coll_prod_read on public.collection_products;
create policy coll_prod_read on public.collection_products for select using (true);
drop policy if exists coll_prod_write on public.collection_products;
create policy coll_prod_write on public.collection_products for all using (public.is_admin()) with check (public.is_admin());

-- size_guides
drop policy if exists size_guides_read on public.size_guides;
create policy size_guides_read on public.size_guides for select using (is_active or public.is_admin());
drop policy if exists size_guides_write on public.size_guides;
create policy size_guides_write on public.size_guides for all using (public.is_admin()) with check (public.is_admin());

-- instagram_reels
drop policy if exists reels_read on public.instagram_reels;
create policy reels_read on public.instagram_reels for select using (is_active or public.is_admin());
drop policy if exists reels_write on public.instagram_reels;
create policy reels_write on public.instagram_reels for all using (public.is_admin()) with check (public.is_admin());

-- menus
drop policy if exists menus_read on public.menus;
create policy menus_read on public.menus for select using (true);
drop policy if exists menus_write on public.menus;
create policy menus_write on public.menus for all using (public.is_admin()) with check (public.is_admin());

-- menu_items
drop policy if exists menu_items_read on public.menu_items;
create policy menu_items_read on public.menu_items for select using (is_active or public.is_admin());
drop policy if exists menu_items_write on public.menu_items;
create policy menu_items_write on public.menu_items for all using (public.is_admin()) with check (public.is_admin());

-- inquiries: cualquiera puede crear (consulta pública); solo admin lee/edita
drop policy if exists inquiries_insert on public.inquiries;
create policy inquiries_insert on public.inquiries for insert with check (true);
drop policy if exists inquiries_read on public.inquiries;
create policy inquiries_read on public.inquiries for select using (public.is_admin());
drop policy if exists inquiries_update on public.inquiries;
create policy inquiries_update on public.inquiries for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists inquiries_delete on public.inquiries;
create policy inquiries_delete on public.inquiries for delete using (public.is_admin());

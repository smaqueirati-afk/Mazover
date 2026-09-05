-- ============================================================================
-- MAZOVER · SETUP COMPLETO (idempotente). Pegar todo en Supabase SQL Editor.
-- schema.sql + policies.sql + storage.sql + seed.sql
-- ============================================================================

-- >>>>>>>>>> 1) SCHEMA <<<<<<<<<<
-- ============================================================================
-- MAZOVER · Esquema de base de datos (Supabase / PostgreSQL)
-- Ejecutar en el SQL Editor de Supabase (o vía CLI). Orden: schema -> policies -> seed.
-- Todo el contenido del sitio es editable desde el panel: nada hardcodeado.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helper: updated_at automático
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ---------------------------------------------------------------------------
-- Perfiles / administradores (sobre auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Devuelve true si el usuario autenticado es admin. SECURITY DEFINER para
-- poder leer profiles desde las policies sin recursión de RLS.
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_admin = true
  );
$$;

-- Crea el profile automáticamente al registrarse un usuario en auth.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Configuración global (una sola fila) — marca, colores, contacto, SEO
-- ---------------------------------------------------------------------------
create table if not exists public.settings (
  id                 uuid primary key default gen_random_uuid(),
  brand_name         text not null default 'MAZOVER',
  brand_tagline      text not null default 'Hecho y para argentinos',
  logo_url           text,
  whatsapp_number    text default '5491100000000',      -- placeholder editable
  whatsapp_message   text default 'Hola, quiero consultar por:',
  instagram_url      text default 'https://instagram.com/mazover',
  instagram_handle   text default '@mazover',
  email              text default 'hola@mazover.com',
  address            text,
  -- Paleta (manual azul) — editable para cambiar acentos sin tocar código
  color_ink          text not null default '#0D1326',
  color_surface      text not null default '#F5F4F1',
  color_blue         text not null default '#1E3B63',
  color_celeste      text not null default '#A7C7E7',
  color_sand         text not null default '#D8C3A6',
  color_red          text not null default '#B0362B',
  -- SEO global
  seo_title          text default 'MAZOVER — Hecho y para argentinos',
  seo_description    text default 'Jeans diseñados y fabricados en Argentina, con materiales seleccionados y una obsesión por cada detalle.',
  seo_og_image       text,
  currency           text not null default 'ARS',
  currency_symbol    text not null default '$',
  updated_at         timestamptz not null default now()
);
alter table public.settings add column if not exists palette text not null default 'heritage';
drop trigger if exists settings_updated on public.settings;
create trigger settings_updated before update on public.settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Bloques de contenido — CADA texto/imagen de las secciones del sitio
-- key ej: 'home.hero.title'. Sembrados con defaults; el dueño edita todo.
-- ---------------------------------------------------------------------------
create table if not exists public.content_blocks (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,
  section     text not null default 'general',   -- agrupa en el admin
  label       text,                              -- etiqueta legible en el admin
  type        text not null default 'text',      -- text | richtext | image | html
  value       text,
  image_url   text,
  position    int not null default 0,
  updated_at  timestamptz not null default now()
);
create index if not exists content_blocks_section_idx on public.content_blocks(section);
drop trigger if exists content_blocks_updated on public.content_blocks;
create trigger content_blocks_updated before update on public.content_blocks
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Taxonomías: categorías, cortes (fits), talles, colores globales, colecciones
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  parent_id   uuid references public.categories(id) on delete set null,
  image_url   text,
  position    int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists categories_parent_idx on public.categories(parent_id);

create table if not exists public.fits (
  id        uuid primary key default gen_random_uuid(),
  name      text not null,
  slug      text not null unique,
  position  int not null default 0,
  is_active boolean not null default true
);

create table if not exists public.sizes (
  id        uuid primary key default gen_random_uuid(),
  label     text not null unique,       -- '38', '40', 'S', 'M'...
  position  int not null default 0,
  is_active boolean not null default true
);

create table if not exists public.colors (
  id        uuid primary key default gen_random_uuid(),
  name      text not null,
  slug      text not null unique,
  hex       text not null default '#1E3B63',
  position  int not null default 0,
  is_active boolean not null default true
);

create table if not exists public.collections (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  image_url   text,
  position    int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Productos
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text not null unique,
  short_description text,
  description       text,
  category_id       uuid references public.categories(id) on delete set null,
  fit_id            uuid references public.fits(id) on delete set null,
  composition       text,                       -- ej: '100% algodón · 14.5 oz'
  price             numeric(12,2) not null default 0,
  compare_at_price  numeric(12,2),              -- precio anterior (tachado)
  is_featured       boolean not null default false,
  is_new            boolean not null default false,
  is_bestseller     boolean not null default false,
  is_active         boolean not null default true,
  position          int not null default 0,
  seo_title         text,
  seo_description   text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_fit_idx on public.products(fit_id);
create index if not exists products_active_idx on public.products(is_active);
drop trigger if exists products_updated on public.products;
create trigger products_updated before update on public.products
  for each row execute function public.set_updated_at();

-- Colores de un producto (cada uno con su propia galería, SKU base y stock)
create table if not exists public.product_colors (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references public.products(id) on delete cascade,
  color_id       uuid references public.colors(id) on delete set null,
  name           text not null,              -- 'Azul Stone'
  hex            text not null default '#1E3B63',
  internal_code  text,                       -- código interno del taller
  sku_base       text,                       -- 'JEAN-ESS-BLU'
  price_override numeric(12,2),              -- opcional, pisa el precio del producto
  position       int not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);
create index if not exists product_colors_product_idx on public.product_colors(product_id);

-- Talles/stock por (producto + color). Cada combinación = una unidad vendible.
create table if not exists public.product_variants (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid not null references public.products(id) on delete cascade,
  product_color_id uuid not null references public.product_colors(id) on delete cascade,
  size_id          uuid not null references public.sizes(id) on delete cascade,
  sku              text unique,               -- 'JEAN-ESS-BLU-42'
  stock            int not null default 0,
  price_override   numeric(12,2),
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  unique (product_color_id, size_id)
);
create index if not exists variants_product_idx on public.product_variants(product_id);
create index if not exists variants_color_idx on public.product_variants(product_color_id);

-- Imágenes (por producto, opcionalmente atadas a un color → galería por color)
create table if not exists public.product_images (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid not null references public.products(id) on delete cascade,
  product_color_id uuid references public.product_colors(id) on delete cascade,
  url              text not null,
  alt              text,
  position         int not null default 0,
  is_cover         boolean not null default false,
  created_at       timestamptz not null default now()
);
create index if not exists product_images_product_idx on public.product_images(product_id);
create index if not exists product_images_color_idx on public.product_images(product_color_id);

-- Relación producto ↔ colección (m2m)
create table if not exists public.collection_products (
  collection_id uuid not null references public.collections(id) on delete cascade,
  product_id    uuid not null references public.products(id) on delete cascade,
  position      int not null default 0,
  primary key (collection_id, product_id)
);

-- ---------------------------------------------------------------------------
-- Guías de talles (matriz editable desde el panel)
-- ---------------------------------------------------------------------------
create table if not exists public.size_guides (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category_id uuid references public.categories(id) on delete set null,
  columns     jsonb not null default '["Talle","Cintura","Cadera","Largo"]'::jsonb,
  rows        jsonb not null default '[]'::jsonb,   -- [["38","76","92","100"], ...]
  is_active   boolean not null default true,
  updated_at  timestamptz not null default now()
);
drop trigger if exists size_guides_updated on public.size_guides;
create trigger size_guides_updated before update on public.size_guides
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Reels de Instagram (shoppables) — url del reel + poster + producto asociado
-- ---------------------------------------------------------------------------
create table if not exists public.instagram_reels (
  id            uuid primary key default gen_random_uuid(),
  instagram_url text not null,               -- https://instagram.com/reel/...
  poster_url    text,                        -- miniatura (Storage o IG)
  caption       text,
  product_id    uuid references public.products(id) on delete set null,
  position      int not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Menús administrables (mega-menú jerárquico tipo Volcom)
-- ---------------------------------------------------------------------------
create table if not exists public.menus (
  id         uuid primary key default gen_random_uuid(),
  handle     text not null unique,           -- 'main' | 'footer' | 'mobile'
  name       text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id           uuid primary key default gen_random_uuid(),
  menu_id      uuid not null references public.menus(id) on delete cascade,
  parent_id    uuid references public.menu_items(id) on delete cascade,
  label        text not null,
  link_type    text not null default 'url',  -- category|collection|product|page|url
  link_ref     text,                         -- slug/id/url según link_type
  image_url    text,                         -- tile destacado del mega-menú
  column_group text,                         -- agrupación visual en el mega-menú
  position     int not null default 0,
  is_active    boolean not null default true,
  open_new_tab boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists menu_items_menu_idx on public.menu_items(menu_id);
create index if not exists menu_items_parent_idx on public.menu_items(parent_id);

-- ---------------------------------------------------------------------------
-- Consultas / pedidos por WhatsApp (registro para el dueño)
-- ---------------------------------------------------------------------------
create table if not exists public.inquiries (
  id             uuid primary key default gen_random_uuid(),
  items          jsonb not null default '[]'::jsonb,  -- [{product, color, size, qty}]
  customer_name  text,
  customer_phone text,
  total_estimate numeric(12,2),
  source         text not null default 'whatsapp',
  status         text not null default 'nuevo',       -- nuevo|leido|respondido|cerrado
  created_at     timestamptz not null default now()
);
create index if not exists inquiries_status_idx on public.inquiries(status);

-- >>>>>>>>>> 2) POLICIES (RLS) <<<<<<<<<<
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

-- ---------------------------------------------------------------------------
-- Suscriptores del newsletter
-- ---------------------------------------------------------------------------
create table if not exists public.subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  source     text not null default 'newsletter',   -- newsletter|footer|popup
  status     text not null default 'activo',        -- activo|baja
  created_at timestamptz not null default now()
);
create index if not exists subscribers_created_idx on public.subscribers(created_at desc);

alter table public.subscribers enable row level security;

-- subscribers: cualquiera se suscribe (insert público); solo admin lee/edita/borra
drop policy if exists subscribers_insert on public.subscribers;
create policy subscribers_insert on public.subscribers for insert with check (true);
drop policy if exists subscribers_read on public.subscribers;
create policy subscribers_read on public.subscribers for select using (public.is_admin());
drop policy if exists subscribers_update on public.subscribers;
create policy subscribers_update on public.subscribers for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists subscribers_delete on public.subscribers;
create policy subscribers_delete on public.subscribers for delete using (public.is_admin());

-- >>>>>>>>>> 3) STORAGE <<<<<<<<<<
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

-- >>>>>>>>>> 4) SEED <<<<<<<<<<
-- ============================================================================
-- MAZOVER · Datos iniciales (defaults editables desde el panel)
-- Ejecutar DESPUÉS de schema.sql y policies.sql.
-- Las imágenes /demo/* viven en public/demo (reemplazables desde el admin).
-- ============================================================================

-- ---- Configuración global (una fila) ----
insert into public.settings (brand_name) values ('MAZOVER')
on conflict do nothing;

-- ---- Contenido de las secciones de la Home (cada coma editable) ----
insert into public.content_blocks (key, section, label, type, value, image_url, position) values
  ('home.hero.eyebrow',   'home_hero', 'Hero · bajada',        'text',  'Hecho y para argentinos', null, 1),
  ('home.hero.title',     'home_hero', 'Hero · título',        'text',  'Calidad que se siente.', null, 2),
  ('home.hero.subtitle',  'home_hero', 'Hero · subtítulo',     'text',  'Jeans diseñados y fabricados en Argentina, con materiales seleccionados y una obsesión por cada detalle. Para tu día a día.', null, 3),
  ('home.hero.cta1',      'home_hero', 'Hero · CTA principal', 'text',  'Descubrir colección', null, 4),
  ('home.hero.cta2',      'home_hero', 'Hero · CTA secundario','text',  'Conocer la marca', null, 5),
  ('home.hero.badge',     'home_hero', 'Hero · etiqueta',      'text',  'Nueva colección', null, 6),
  ('home.hero.image',     'home_hero', 'Hero · imagen',        'image', null, '/demo/hero.jpg', 7),
  ('home.marquee.items',  'home_marquee','Franja de atributos','text',  'Algodón premium|Confort|Durabilidad|Diseño atemporal|Orgullo argentino', null, 1),
  ('home.philo.eyebrow',  'home_philo','Filosofía · bajada',   'text',  'Nuestra esencia', null, 1),
  ('home.philo.title',    'home_philo','Filosofía · título',   'text',  'Hecho acá. Pensado para durar.', null, 2),
  ('home.philo.body',     'home_philo','Filosofía · texto',    'richtext', 'Creemos que un buen jean no debería depender de una tendencia. Debería acompañarte durante años, adaptarse a tu forma de vivir y mejorar con el tiempo.

Trabajamos con talleres argentinos, algodón seleccionado y una confección obsesiva: cada costura, cada remache y cada botón están pensados para resistir el uso real.', null, 3),
  ('home.philo.image',    'home_philo','Filosofía · imagen',   'image', null, '/demo/texture.jpg', 4),
  ('home.philo.detail',   'home_philo','Filosofía · detalle',  'image', null, '/demo/button.jpg', 5),
  ('home.band.eyebrow',   'home_band', 'Banda · bajada',       'text',  'Los códigos del jean', null, 1),
  ('home.band.title',     'home_band', 'Banda · título',       'text',  'Corte cómodo. Costuras reforzadas. Detalles que duran.', null, 2),
  ('home.band.image',     'home_band', 'Banda · imagen',       'image', null, '/demo/detail.jpg', 3),
  ('home.collection.eyebrow','home_collection','Colección · bajada','text','Colección destacada', null, 1),
  ('home.collection.title',  'home_collection','Colección · título','text','Cortes que se quedan', null, 2),
  ('home.reels.eyebrow',  'home_reels','Reels · handle',       'text',  '@mazover', null, 1),
  ('home.reels.title',    'home_reels','Reels · título',       'text',  'Mirá cómo se usan', null, 2),
  ('home.made.eyebrow',   'home_made', 'Hecho en Arg · bajada','text',  'Hecho en Argentina', null, 1),
  ('home.made.title',     'home_made', 'Hecho en Arg · título','text',  'Diseñado acá. Fabricado acá. Seleccionado para durar.', null, 2),
  ('home.made.col1.title','home_made', 'Columna 1 · título',   'text',  'Diseñado acá', null, 3),
  ('home.made.col1.body', 'home_made', 'Columna 1 · texto',    'text',  'Cada corte nace en nuestro taller: probamos, ajustamos y repetimos hasta que el jean cae como tiene que caer.', null, 4),
  ('home.made.col2.title','home_made', 'Columna 2 · título',   'text',  'Fabricado acá', null, 5),
  ('home.made.col2.body', 'home_made', 'Columna 2 · texto',    'text',  'Trabajamos con confeccionistas argentinos. El trabajo bien hecho sostiene a personas reales, no solo a una etiqueta.', null, 6),
  ('home.made.col3.title','home_made', 'Columna 3 · título',   'text',  'Para durar', null, 7),
  ('home.made.col3.body', 'home_made', 'Columna 3 · texto',    'text',  'Denim de gramaje alto, costuras reforzadas y avíos que resisten. Un jean para años, no para una temporada.', null, 8),
  ('home.made.image_a',   'home_made', 'Hecho en Arg · foto 1','image', null, '/demo/atelier.jpg', 9),
  ('home.made.image_b1',  'home_made', 'Hecho en Arg · foto 2','image', null, '/demo/texture.jpg', 10),
  ('home.made.image_b2',  'home_made', 'Hecho en Arg · foto 3','image', null, '/demo/button.jpg', 11),
  ('home.frases.1',       'home_frases','Frase 1',             'text',  'Hecho y para argentinos', null, 1),
  ('home.frases.2',       'home_frases','Frase 2',             'text',  'Orgullo que se viste', null, 2),
  ('home.frases.3',       'home_frases','Frase 3',             'text',  'Para tu día a día', null, 3),
  ('home.cta.eyebrow',    'home_cta',  'CTA final · bajada',   'text',  'Comprá por WhatsApp', null, 1),
  ('home.cta.title',      'home_cta',  'CTA final · título',   'text',  'Elegí tu corte. Nosotros hacemos el resto.', null, 2),
  ('home.cta.button',     'home_cta',  'CTA final · botón',    'text',  'Ver la colección', null, 3),
  ('footer.about',        'footer',    'Footer · descripción', 'text',  'Denim diseñado y fabricado en Argentina. Calidad que se siente, orgullo que se viste.', null, 1)
on conflict (key) do nothing;

-- Rediseño visual v2: hero (títulos/kicker), franja de features, especificaciones y horario CTA
insert into public.content_blocks (key, section, label, type, value, image_url, position) values
  ('home.hero.title_1','home_hero','Hero · título línea 1','text','Por siempre',null,20),
  ('home.hero.title_2','home_hero','Hero · título línea 2','text','Argentinas',null,21),
  ('home.hero.kicker','home_hero','Hero · kicker','text','Orgullo que se viste',null,22),
  ('home.features.1.title','home_features','Feature 1 · título','text','Algodón premium',null,1),
  ('home.features.1.body','home_features','Feature 1 · texto','text','Suave y resistente',null,2),
  ('home.features.2.title','home_features','Feature 2 · título','text','Corte clásico y cómodo',null,3),
  ('home.features.2.body','home_features','Feature 2 · texto','text','Para todos los días',null,4),
  ('home.features.3.title','home_features','Feature 3 · título','text','Bordado de calidad',null,5),
  ('home.features.3.body','home_features','Feature 3 · texto','text','Detalles que duran',null,6),
  ('home.features.4.title','home_features','Feature 4 · título','text','Hecho en Argentina',null,7),
  ('home.features.4.body','home_features','Feature 4 · texto','text','Diseñado y producido con orgullo',null,8),
  ('home.specs.1.label','home_specs','Spec 1 · label','text','Denim',null,1),
  ('home.specs.1.value','home_specs','Spec 1 · valor','text','14.5 oz rígido',null,2),
  ('home.specs.2.label','home_specs','Spec 2 · label','text','Composición',null,3),
  ('home.specs.2.value','home_specs','Spec 2 · valor','text','100% algodón',null,4),
  ('home.specs.3.label','home_specs','Spec 3 · label','text','Confección',null,5),
  ('home.specs.3.value','home_specs','Spec 3 · valor','text','Taller propio',null,6),
  ('home.specs.4.label','home_specs','Spec 4 · label','text','Origen',null,7),
  ('home.specs.4.value','home_specs','Spec 4 · valor','text','Argentina',null,8),
  ('home.collection.link','home_collection','Colección · link','text','Ver toda la colección',null,3),
  ('home.product.cta','home_collection','Card · botón','text','Ver producto',null,4),
  ('home.product.cuotas','home_collection','Card · cantidad de cuotas','text','3',null,5),
  ('home.reels.link','home_reels','Reels · link','text','Seguinos en Instagram',null,3),
  ('home.cta.whatsapp','home_cta','CTA · botón WhatsApp','text','Comprar por WhatsApp',null,3),
  ('home.cta.hours','home_cta','CTA · horario','text','Respondemos de 9 a 19 h · Lun a sáb',null,4),
  ('product.ship.title','producto','Detalle · Envíos (título)','text','Envíos y cambios',null,1),
  ('product.ship.body','producto','Detalle · Envíos (texto)','richtext','Coordinamos envíos a todo el país. Cambios dentro de los 30 días con la prenda sin uso. Consultanos por WhatsApp.',null,2)
on conflict (key) do nothing;

-- Ajustes de claves existentes (badge/cta) para el rediseño
update public.content_blocks set value='Nuevo' where key='home.hero.badge';
update public.content_blocks set value='Ver colección' where key='home.hero.cta1';

-- Página LA MARCA y HECHO EN ARGENTINA
insert into public.content_blocks (key, section, label, type, value, image_url, position) values
  ('lamarca.hero.eyebrow','page_lamarca','La Marca · bajada','text','La marca',null,1),
  ('lamarca.hero.title','page_lamarca','La Marca · título','text','Denim con oficio, hecho acá.',null,2),
  ('lamarca.hero.image','page_lamarca','La Marca · imagen hero','image',null,'/demo/detail.jpg',3),
  ('lamarca.intro','page_lamarca','La Marca · intro','richtext','MAZOVER nació de una idea simple y terca: hacer, en Argentina, el jean que siempre quisimos usar. Sin atajos, sin temporada de descarte, sin depender de una moda que cambia cada tres meses.

Creemos en el trabajo bien hecho y en la ropa que mejora con los años. Un buen jean no se compra seguido: se elige una vez y se usa hasta que se vuelve tuyo.',null,4),
  ('lamarca.s1.title','page_lamarca','Sección 1 · título','text','Diseño',null,5),
  ('lamarca.s1.body','page_lamarca','Sección 1 · texto','text','Cada corte se prueba, se ajusta y se vuelve a probar hasta que cae como tiene que caer. Buscamos siluetas que no cansen: modernas, cómodas y atemporales.',null,6),
  ('lamarca.s1.image','page_lamarca','Sección 1 · imagen','image',null,'/demo/hero.jpg',7),
  ('lamarca.s2.title','page_lamarca','Sección 2 · título','text','Materiales',null,8),
  ('lamarca.s2.body','page_lamarca','Sección 2 · texto','text','Trabajamos con denim de gramaje alto, avíos metálicos y costuras reforzadas. Materiales seleccionados para que la prenda resista el uso real de todos los días.',null,9),
  ('lamarca.s2.image','page_lamarca','Sección 2 · imagen','image',null,'/demo/texture.jpg',10),
  ('lamarca.quote','page_lamarca','La Marca · frase','text','Menos moda, más propósito. Calidad que se siente.',null,11),
  ('hecho.hero.eyebrow','page_hecho','Hecho · bajada','text','Hecho en Argentina',null,1),
  ('hecho.hero.title','page_hecho','Hecho · título','text','Diseñado, fabricado y pensado para durar.',null,2),
  ('hecho.hero.image','page_hecho','Hecho · imagen hero','image',null,'/demo/atelier.jpg',3),
  ('hecho.intro','page_hecho','Hecho · intro','text','No es una etiqueta: es cómo trabajamos. Diseñamos y fabricamos en Argentina, con talleres locales y gente que sabe lo que hace.',null,4),
  ('hecho.b1.title','page_hecho','Bloque 1 · título','text','Diseñado acá',null,5),
  ('hecho.b1.body','page_hecho','Bloque 1 · texto','text','El proceso empieza en nuestro taller. Moldería propia, pruebas de calce y ajustes hasta llegar al corte final.',null,6),
  ('hecho.b1.image','page_hecho','Bloque 1 · imagen','image',null,'/demo/hero.jpg',7),
  ('hecho.b2.title','page_hecho','Bloque 2 · título','text','Fabricado acá',null,8),
  ('hecho.b2.body','page_hecho','Bloque 2 · texto','text','Confeccionistas argentinos, tanda a tanda. El trabajo bien hecho sostiene a personas reales.',null,9),
  ('hecho.b2.image','page_hecho','Bloque 2 · imagen','image',null,'/demo/atelier.jpg',10),
  ('hecho.b3.title','page_hecho','Bloque 3 · título','text','Seleccionado para durar',null,11),
  ('hecho.b3.body','page_hecho','Bloque 3 · texto','text','Denim de gramaje alto, costuras dobles y avíos que aguantan. Nada decorativo: todo pensado para el uso.',null,12),
  ('hecho.b3.image','page_hecho','Bloque 3 · imagen','image',null,'/demo/texture.jpg',13)
on conflict (key) do nothing;

-- ---- Cortes (fits) ----
insert into public.fits (name, slug, position) values
  ('Slim','slim',1),('Straight','straight',2),('Relaxed','relaxed',3),
  ('Loose','loose',4),('Tapered','tapered',5)
on conflict (slug) do nothing;

-- ---- Talles ----
insert into public.sizes (label, position) values
  ('38',1),('40',2),('42',3),('44',4),('46',5)
on conflict (label) do nothing;

-- ---- Categorías ----
insert into public.categories (name, slug, position) values
  ('Jeans','jeans',1),('Camisas','camisas',2),('Chinos','chinos',3),
  ('Camperas','camperas',4),('Accesorios','accesorios',5)
on conflict (slug) do nothing;

-- ---- Colores globales ----
insert into public.colors (name, slug, hex, position) values
  ('Índigo Raw','indigo-raw','#1E3B63',1),
  ('Negro','negro','#0D1326',2),
  ('Gris Stone','gris-stone','#4A4A4A',3),
  ('Azul Stone','azul-stone','#2A4E7E',4)
on conflict (slug) do nothing;

-- ---- Colecciones ----
insert into public.collections (name, slug, position) values
  ('Nueva temporada','nueva-temporada',1),
  ('Índigo Raw','indigo-raw',2),
  ('Clásicos','clasicos',3),
  ('Últimos talles','ultimos-talles',4)
on conflict (slug) do nothing;

-- ---- Productos de ejemplo ----
insert into public.products (name, slug, short_description, description, category_id, fit_id, composition, price, is_featured, is_new, is_active, position)
select 'Jean Relaxed', 'jean-relaxed',
       'Corte relajado en índigo profundo, para todos los días.',
       'El Jean Relaxed cae holgado sin perder forma. Denim de gramaje alto, costuras reforzadas y avíos metálicos pensados para durar años.',
       (select id from public.categories where slug='jeans'),
       (select id from public.fits where slug='relaxed'),
       '100% algodón · 14.5 oz', 95000, true, true, true, 1
where not exists (select 1 from public.products where slug='jean-relaxed');

insert into public.products (name, slug, short_description, description, category_id, fit_id, composition, price, is_featured, is_active, position)
select 'Jean Straight', 'jean-straight',
       'Corte recto clásico, cómodo y atemporal.',
       'El Jean Straight es el corte de siempre, bien resuelto. Cae parejo desde la cadera al ruedo, con la robustez del denim argentino.',
       (select id from public.categories where slug='jeans'),
       (select id from public.fits where slug='straight'),
       '98% algodón · 2% elastano · 13 oz', 89000, true, true, 2
where not exists (select 1 from public.products where slug='jean-straight');

-- ---- Colores de cada producto ----
insert into public.product_colors (product_id, color_id, name, hex, sku_base, position)
select p.id, c.id, c.name, c.hex, 'JEAN-REL-'||upper(left(c.slug,3)), c.position
from public.products p join public.colors c on c.slug in ('indigo-raw','negro')
where p.slug='jean-relaxed'
  and not exists (select 1 from public.product_colors pc where pc.product_id=p.id and pc.name=c.name);

insert into public.product_colors (product_id, color_id, name, hex, sku_base, position)
select p.id, c.id, c.name, c.hex, 'JEAN-STR-'||upper(left(c.slug,3)), c.position
from public.products p join public.colors c on c.slug in ('gris-stone','azul-stone')
where p.slug='jean-straight'
  and not exists (select 1 from public.product_colors pc where pc.product_id=p.id and pc.name=c.name);

-- ---- Variantes (color × talle) con stock (38 y 46 agotados para mostrar estados) ----
insert into public.product_variants (product_id, product_color_id, size_id, sku, stock)
select pc.product_id, pc.id, s.id, coalesce(pc.sku_base,'SKU')||'-'||s.label,
       case when s.label in ('38','46') then 0 else 6 end
from public.product_colors pc
join public.sizes s on true
join public.products p on p.id = pc.product_id
where p.slug in ('jean-relaxed','jean-straight')
  and not exists (
    select 1 from public.product_variants v where v.product_color_id=pc.id and v.size_id=s.id
  );

-- ---- Imágenes por color ----
-- Jean Relaxed · Índigo Raw
insert into public.product_images (product_id, product_color_id, url, alt, position, is_cover)
select pc.product_id, pc.id, x.url, x.alt, x.pos, x.cover
from public.product_colors pc
join public.products p on p.id=pc.product_id and p.slug='jean-relaxed' and pc.name='Índigo Raw'
join (values
  ('/demo/lifestyle.jpg','Jean Relaxed Índigo — frente',0,true),
  ('/demo/hero.jpg','Jean Relaxed Índigo — look',1,false),
  ('/demo/detail.jpg','Jean Relaxed Índigo — detalle',2,false),
  ('/demo/texture.jpg','Jean Relaxed Índigo — textura',3,false)
) as x(url,alt,pos,cover) on true
where not exists (select 1 from public.product_images i where i.product_color_id=pc.id);

-- Jean Straight · Gris Stone
insert into public.product_images (product_id, product_color_id, url, alt, position, is_cover)
select pc.product_id, pc.id, x.url, x.alt, x.pos, x.cover
from public.product_colors pc
join public.products p on p.id=pc.product_id and p.slug='jean-straight' and pc.name='Gris Stone'
join (values
  ('/demo/product.jpg','Jean Straight Gris — frente',0,true),
  ('/demo/detail.jpg','Jean Straight Gris — detalle',1,false),
  ('/demo/texture.jpg','Jean Straight Gris — textura',2,false)
) as x(url,alt,pos,cover) on true
where not exists (select 1 from public.product_images i where i.product_color_id=pc.id);

-- ---- Reels de Instagram (shoppables) ----
insert into public.instagram_reels (instagram_url, poster_url, caption, product_id, position)
select v.url, v.poster, v.caption,
       (select id from public.products where slug=v.pslug), v.pos
from (values
  ('https://instagram.com/mazover','/demo/hero.jpg','El Relaxed en la calle, todos los días.','jean-relaxed',1),
  ('https://instagram.com/mazover','/demo/lifestyle.jpg','Cómo cae el corte recto en movimiento.','jean-straight',2),
  ('https://instagram.com/mazover','/demo/detail.jpg','Costuras y avíos, de cerca.',null,3),
  ('https://instagram.com/mazover','/demo/atelier.jpg','Así se hace un jean en el taller.',null,4)
) as v(url,poster,caption,pslug,pos)
where not exists (select 1 from public.instagram_reels);

-- ---- Menú principal (mega-menú) ----
insert into public.menus (handle, name) values ('main','Menú principal'), ('footer','Footer')
on conflict (handle) do nothing;

-- Item raíz "Colección" + hijos agrupados en columnas + tile destacado
do $$
declare m uuid; root uuid;
begin
  select id into m from public.menus where handle='main';
  if not exists (select 1 from public.menu_items where menu_id=m and label='Colección') then
    insert into public.menu_items (menu_id, label, link_type, link_ref, position)
      values (m,'Colección','url','/productos',1) returning id into root;
    insert into public.menu_items (menu_id, parent_id, label, link_type, link_ref, column_group, position) values
      (m,root,'Slim','fit','slim','Por corte',1),
      (m,root,'Straight','fit','straight','Por corte',2),
      (m,root,'Relaxed','fit','relaxed','Por corte',3),
      (m,root,'Loose','fit','loose','Por corte',4),
      (m,root,'Tapered','fit','tapered','Por corte',5),
      (m,root,'Jeans','category','jeans','Categorías',1),
      (m,root,'Camisas','category','camisas','Categorías',2),
      (m,root,'Chinos','category','chinos','Categorías',3),
      (m,root,'Camperas','category','camperas','Categorías',4),
      (m,root,'Accesorios','category','accesorios','Categorías',5),
      (m,root,'Nueva temporada','collection','nueva-temporada','Colecciones',1),
      (m,root,'Índigo Raw','collection','indigo-raw','Colecciones',2),
      (m,root,'Clásicos','collection','clasicos','Colecciones',3),
      (m,root,'Últimos talles','collection','ultimos-talles','Colecciones',4);
    insert into public.menu_items (menu_id, parent_id, label, link_type, link_ref, image_url, column_group, position)
      values (m,root,'Jean Relaxed Índigo','product','jean-relaxed','/demo/lifestyle.jpg','Destacado',1);
    -- items de primer nivel adicionales
    insert into public.menu_items (menu_id, label, link_type, link_ref, position) values
      (m,'Inicio','url','/',0),
      (m,'Nosotros','page','la-marca',2),
      (m,'Guía de talles','url','/productos',3),
      (m,'Contacto','url','https://wa.me/5491100000000',4);
  end if;
end $$;

-- ---- Guía de talles ----
insert into public.size_guides (name, columns, rows)
select 'Jeans', '["Talle","Cintura (cm)","Cadera (cm)","Largo (cm)"]'::jsonb,
  '[["38","76","92","100"],["40","80","96","102"],["42","84","100","104"],["44","88","104","106"],["46","92","108","108"]]'::jsonb
where not exists (select 1 from public.size_guides where name='Jeans');

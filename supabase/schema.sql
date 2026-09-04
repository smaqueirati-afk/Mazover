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

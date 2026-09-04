# MAZOVER — Tienda de denim premium argentino

Sitio de e-commerce (catálogo + consulta por WhatsApp) con panel de administración.
Todo el contenido es **editable desde el panel**: nada hardcodeado.

- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript estricto · Tailwind v4 · Supabase (DB + Auth + Storage) · Vercel · Lucide-style icons.
- **Identidad:** manual de marca azul — Oswald + Montserrat, azul profundo / azul / celeste / arena / rojo, emblema sol.

---

## 1. Requisitos

- Node.js 20+ (probado con Node 24).
- Una cuenta de [Supabase](https://supabase.com) (plan free alcanza).

## 2. Instalación

```bash
npm install
cp .env.example .env.local   # y completá las variables (ver abajo)
npm run dev
```

Sin Supabase configurado el sitio **igual corre** con datos de ejemplo (fotos en `public/demo`).
El panel `/admin` muestra una guía hasta que conectes Supabase.

## 3. Supabase (base de datos, auth y storage)

En el **SQL Editor** de tu proyecto Supabase, ejecutá en este orden:

1. `supabase/schema.sql` — tablas, funciones, triggers.
2. `supabase/policies.sql` — Row Level Security (lectura pública / escritura admin).
3. `supabase/seed.sql` — datos iniciales (configuración, contenido, taxonomías, menú, 2 productos de ejemplo, reels, guía de talles).
4. `supabase/storage.sql` — buckets `products` y `content` + políticas.

### Variables de entorno (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# SUPABASE_SERVICE_ROLE_KEY=...   # solo servidor, opcional. NUNCA con NEXT_PUBLIC_
```

> La `anon key` es pública por diseño; la seguridad la da RLS. La `service_role` nunca se expone al cliente.

### Crear un administrador

1. Supabase → **Authentication → Users → Add user** (email + contraseña).
2. Supabase → **Table editor → profiles** → en la fila de ese usuario, poné `is_admin = true`.
   (El perfil se crea solo al registrarse, vía trigger.)
3. Ingresá en `/admin/login`.

## 4. Scripts

```bash
npm run dev     # desarrollo
npm run build   # build de producción
npm run start   # servir el build
npm run lint    # eslint
```

## 5. Estructura

```
app/
  (site)/            sitio público (layout con header/footer/carrito)
    page.tsx         Home
    productos/       catálogo + [slug] detalle
    carrito/         carrito → WhatsApp
  admin/
    login/           ingreso
    (panel)/         panel protegido (dashboard, productos, contenido, config, …)
components/
  site/              Header, Footer, Catalog, ProductCard, ProductView, CartView…
  admin/             AdminNav, ProductEditor, NotConfigured
lib/
  supabase/          clientes (browser, server, middleware)
  data.ts            lectura del sitio (Supabase con fallback a defaults)
  admin.ts           lecturas del panel
  cart.tsx           carrito (context + localStorage)
  filter.ts          filtros de catálogo
  whatsapp.ts        armado de links de WhatsApp
content/defaults.ts  contenido/productos de ejemplo (fallback sin Supabase)
supabase/            schema.sql, policies.sql, seed.sql, storage.sql
public/demo/         imágenes de ejemplo (reemplazables desde el panel)
```

## 6. Modelo de datos (resumen)

- `products` → `product_colors` (galería + SKU base + stock propio por color) → `product_variants` (color × talle: SKU, stock, precio opcional).
- `product_images` atadas a un color → cambiar de color cambia la galería.
- `settings` (marca, colores, WhatsApp, SEO) + `content_blocks` (cada texto/imagen de cada sección).
- `menus` + `menu_items` (mega-menú jerárquico administrable).
- `instagram_reels` (reels shoppables), `size_guides`, `collections`, `inquiries`.

## 7. WhatsApp

Configurable desde **Admin → Configuración** (número + mensaje inicial). El detalle de
producto y el carrito arman el mensaje automáticamente con color, talle y total estimado.

## 8. Deploy (Vercel)

1. Subí el repo a GitHub e importalo en Vercel.
2. Cargá las mismas variables de entorno en Vercel (Project Settings → Environment Variables).
3. Deploy. `NEXT_PUBLIC_SITE_URL` = tu dominio de producción.

## 9. Arquitectura futura (preparada, no implementada)

Mercado Pago / pagos, cuentas de clientes, historial de pedidos, cupones, envíos y
mayoristas: el modelo de datos y la capa de acciones están pensados para sumarlos sin
rehacer el sistema.

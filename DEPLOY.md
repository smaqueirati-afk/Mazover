# Deploy de MAZOVER — Supabase + Vercel

Guía paso a paso. Lo que requiere tu cuenta (crear proyecto, pegar keys, autorizar) lo
hacés vos; el código ya está listo y el build pasa sin errores.

---

## Parte 1 — Supabase (base de datos, auth, storage)

1. Entrá a https://supabase.com → **New project**. Elegí nombre, contraseña de DB y región (South America / São Paulo es la más cercana).
2. Cuando esté creado, andá a **SQL Editor → New query**.
3. Abrí el archivo **`supabase/setup.sql`** de este proyecto, copiá **todo** su contenido, pegalo y **Run**.
   - (Alternativa: correr en orden `schema.sql` → `policies.sql` → `storage.sql` → `seed.sql`.)
   - Debería terminar sin errores y dejar 2 productos de ejemplo, contenido, menú y reels.
4. Verificá los buckets: **Storage** → deberían existir `products` y `content` (públicos).
5. Conseguí las claves: **Project Settings → API**:
   - `Project URL` → será `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → será `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - (No uses la `service_role` en el frontend.)

### Crear tu usuario administrador
1. **Authentication → Users → Add user** → email + contraseña (confirmá el email si te lo pide, o usá "Auto Confirm").
2. **SQL Editor**, ejecutá (reemplazá el email):
   ```sql
   update public.profiles set is_admin = true where email = 'TU-EMAIL@ejemplo.com';
   ```
   > El perfil se crea solo al registrarse (trigger). Si la fila no existe todavía, ingresá una vez a la app y volvé a correr el update.

---

## Parte 2 — Probar local con Supabase real (opcional pero recomendado)

```bash
cp .env.example .env.local
# editá .env.local con tu URL y anon key
npm run dev
```
Entrá a `http://localhost:3000/admin/login` con tu usuario admin.

---

## Parte 3 — Vercel (deploy)

Vercel despliega desde un repo de Git. El repo local ya está inicializado con un commit.

### 3.1 Subir a GitHub
1. Creá un repositorio vacío en https://github.com/new (por ej. `mazover`), **sin** README.
2. En la carpeta del proyecto:
   ```bash
   git remote add origin https://github.com/TU-USUARIO/mazover.git
   git branch -M main
   git push -u origin main
   ```

### 3.2 Importar en Vercel
1. https://vercel.com → **Add New… → Project** → importá el repo `mazover`.
2. Framework: **Next.js** (autodetectado). No cambies build/output.
3. **Environment Variables** (Settings → Environment Variables), agregá:
   | Nombre | Valor |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | tu Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | tu anon key |
   | `NEXT_PUBLIC_SITE_URL` | tu dominio final, ej. `https://mazover.vercel.app` |
4. **Deploy**.

### 3.3 Post-deploy
- En Supabase → **Authentication → URL Configuration**, agregá tu dominio de Vercel a **Site URL** y **Redirect URLs**.
- Verificá el sitio y `/admin/login` en producción.

---

## Notas
- Las imágenes de `public/demo` son de ejemplo (IA). Reemplazalas subiendo fotos reales desde el panel (Productos → Imágenes, y Contenido para las secciones).
- `NEXT_PUBLIC_SITE_URL` afecta `sitemap.xml`, `robots.txt` y las Open Graph; ponelo con tu dominio real.
- La `anon key` es pública por diseño (la seguridad la da RLS). Nunca subas la `service_role`.

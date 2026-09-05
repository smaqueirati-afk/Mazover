-- ============================================================================
-- MAZOVER · Newsletter (suscriptores)
-- Pegá y ejecutá este bloque en Supabase → SQL Editor si tu base ya existe.
-- Es idempotente: se puede correr varias veces sin romper nada.
-- ============================================================================

create table if not exists public.subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  source     text not null default 'newsletter',   -- newsletter|footer|popup
  status     text not null default 'activo',        -- activo|baja
  created_at timestamptz not null default now()
);
create index if not exists subscribers_created_idx on public.subscribers(created_at desc);

alter table public.subscribers enable row level security;

-- Cualquiera puede suscribirse (insert público); sólo el admin lee/edita/borra.
drop policy if exists subscribers_insert on public.subscribers;
create policy subscribers_insert on public.subscribers for insert with check (true);
drop policy if exists subscribers_read on public.subscribers;
create policy subscribers_read on public.subscribers for select using (public.is_admin());
drop policy if exists subscribers_update on public.subscribers;
create policy subscribers_update on public.subscribers for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists subscribers_delete on public.subscribers;
create policy subscribers_delete on public.subscribers for delete using (public.is_admin());

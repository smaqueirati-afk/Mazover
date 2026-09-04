"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/colores", label: "Colores" },
  { href: "/admin/talles", label: "Talles" },
  { href: "/admin/menu", label: "Menú" },
  { href: "/admin/reels", label: "Reels" },
  { href: "/admin/contenido", label: "Contenido" },
  { href: "/admin/consultas", label: "Consultas" },
  { href: "/admin/configuracion", label: "Configuración" },
];

export default function AdminNav({ email }: { email?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="adm-side">
      <div className="adm-brand">MAZOVER</div>
      {LINKS.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link key={l.href} href={l.href} className={cn(active && "on")}>
            {l.label}
          </Link>
        );
      })}
      <div className="adm-spacer" />
      <Link href="/" target="_blank">Ver sitio ↗</Link>
      {email && <div style={{ fontSize: 11, color: "rgba(245,244,241,.4)", padding: "8px 12px" }}>{email}</div>}
      <button className="adm-logout" onClick={logout}>Cerrar sesión</button>
    </aside>
  );
}

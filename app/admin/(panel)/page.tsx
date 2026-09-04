import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Metric = { n: number | string; l: string; warn?: boolean; href?: string };

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, is_active, is_featured, product_colors(product_variants(stock))");
  const { count: inquiries } = await supabase
    .from("inquiries")
    .select("id", { count: "exact", head: true });

  const list = products ?? [];
  const activos = list.filter((p) => p.is_active).length;
  const destacados = list.filter((p) => p.is_featured).length;
  let variantes = 0;
  let sinStock = 0;
  for (const p of list) {
    const stocks: number[] = [];
    for (const c of (p.product_colors as { product_variants?: { stock: number }[] }[]) ?? []) {
      for (const v of c.product_variants ?? []) { stocks.push(v.stock); variantes++; }
    }
    if (stocks.length > 0 && stocks.every((s) => s <= 0)) sinStock++;
  }

  const metrics: Metric[] = [
    { n: activos, l: "Productos activos", href: "/admin/productos" },
    { n: sinStock, l: "Productos sin stock", warn: sinStock > 0, href: "/admin/productos" },
    { n: variantes, l: "Variantes (color × talle)" },
    { n: destacados, l: "Destacados" },
    { n: inquiries ?? 0, l: "Consultas", href: "/admin/consultas" },
  ];

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen de la tienda MAZOVER.</p>
        </div>
        <Link className="adm-btn adm-btn-primary" href="/admin/productos/nuevo">+ Nuevo producto</Link>
      </div>

      <div className="adm-grid">
        {metrics.map((m) => {
          const card = (
            <div className={`adm-card adm-metric ${m.warn ? "warn" : ""}`}>
              <div className="n">{m.n}</div>
              <div className="l">{m.l}</div>
            </div>
          );
          return m.href ? <Link key={m.l} href={m.href}>{card}</Link> : <div key={m.l}>{card}</div>;
        })}
      </div>

      <div style={{ marginTop: 30, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link className="adm-btn" href="/admin/productos">Gestionar productos</Link>
        <Link className="adm-btn" href="/admin/contenido">Editar contenido</Link>
        <Link className="adm-btn" href="/admin/menu">Editar menú</Link>
        <Link className="adm-btn" href="/admin/configuracion">Configuración</Link>
      </div>
    </>
  );
}

import { createClient } from "@/lib/supabase/server";

type Item = { name?: string; colorName?: string; sizeLabel?: string; qty?: number };

export default async function ConsultasPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("inquiries")
    .select("id, items, customer_name, total_estimate, status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  const rows = data ?? [];

  return (
    <>
      <div className="adm-head">
        <div><h1>Consultas</h1><p>Pedidos y consultas recibidas.</p></div>
      </div>
      {rows.length === 0 ? (
        <div className="adm-notice">Todavía no hay consultas registradas.</div>
      ) : (
        <table className="adm-table">
          <thead><tr><th>Fecha</th><th>Cliente</th><th>Ítems</th><th>Total est.</th><th>Estado</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.created_at as string).toLocaleDateString("es-AR")}</td>
                <td>{(r.customer_name as string) ?? "—"}</td>
                <td>{((r.items as Item[]) ?? []).map((i) => `${i.qty ?? 1}× ${i.name ?? ""} (${i.colorName ?? ""}/${i.sizeLabel ?? ""})`).join(", ")}</td>
                <td>{r.total_estimate ? `$${r.total_estimate}` : "—"}</td>
                <td><span className="adm-pill warn">{r.status as string}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

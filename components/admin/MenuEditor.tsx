"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveMenuItem, deleteRow } from "@/app/admin/(panel)/catalog.actions";

type Item = { id?: string; menu_id: string; parent_id: string | null; label: string; link_type: string; link_ref: string | null; column_group: string | null; position: number; is_active: boolean };

const LINK_TYPES = ["url", "category", "fit", "collection", "product", "page"];

export default function MenuEditor({ menuId, items }: { menuId: string; items: Item[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [rows, setRows] = useState<Item[]>(items);
  const [msg, setMsg] = useState<string | null>(null);
  const [draft, setDraft] = useState<Item>({ menu_id: menuId, parent_id: null, label: "", link_type: "url", link_ref: "", column_group: "", position: 99, is_active: true });

  const roots = rows.filter((r) => !r.parent_id);
  const edit = (id: string | undefined, patch: Partial<Item>) => setRows((p) => p.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const persist = (r: Item, reset?: () => void) => start(async () => {
    if (!r.label) { setMsg("Falta la etiqueta."); return; }
    const res = await saveMenuItem({ ...r, menu_id: menuId }); setMsg(res.msg); if (res.ok) { reset?.(); router.refresh(); }
  });
  const remove = (id: string) => start(async () => { await deleteRow("menu_items", id); router.refresh(); });

  const renderRow = (r: Item, onChange: (p: Partial<Item>) => void) => (
    <>
      <td><input className="adm-input" value={r.label} onChange={(e) => onChange({ label: e.target.value })} /></td>
      <td>
        <select className="adm-select" value={r.parent_id ?? ""} onChange={(e) => onChange({ parent_id: e.target.value || null })}>
          <option value="">— Raíz —</option>
          {roots.filter((x) => x.id !== r.id).map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
        </select>
      </td>
      <td>
        <select className="adm-select" value={r.link_type} onChange={(e) => onChange({ link_type: e.target.value })}>
          {LINK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </td>
      <td><input className="adm-input" placeholder="slug / url" value={r.link_ref ?? ""} onChange={(e) => onChange({ link_ref: e.target.value })} /></td>
      <td><input className="adm-input" placeholder="columna" value={r.column_group ?? ""} onChange={(e) => onChange({ column_group: e.target.value })} /></td>
      <td><input className="adm-input" style={{ width: 64 }} type="number" value={r.position} onChange={(e) => onChange({ position: Number(e.target.value) })} /></td>
      <td><input type="checkbox" checked={r.is_active} onChange={(e) => onChange({ is_active: e.target.checked })} /></td>
    </>
  );

  return (
    <>
      <div className="adm-head"><div><h1>Menú</h1><p>Constructor del mega-menú. Ítems raíz + hijos (agrupados por columna). Cada ítem apunta a una categoría, corte, colección, producto, página o URL.</p></div></div>
      {msg && <div className="adm-msg ok">{msg}</div>}
      <div style={{ overflowX: "auto" }}>
        <table className="adm-table">
          <thead><tr><th>Etiqueta</th><th>Padre</th><th>Tipo</th><th>Destino (ref)</th><th>Columna</th><th>Orden</th><th>Activo</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={r.parent_id ? { background: "#faf9f7" } : undefined}>
                {renderRow(r, (p) => edit(r.id, p))}
                <td style={{ display: "flex", gap: 6 }}>
                  <button className="adm-btn" disabled={pending} onClick={() => persist(r)}>Guardar</button>
                  <button className="adm-btn adm-btn-danger" disabled={pending} onClick={() => remove(r.id!)}>✕</button>
                </td>
              </tr>
            ))}
            <tr>
              {renderRow(draft, (p) => setDraft((d) => ({ ...d, ...p })))}
              <td><button className="adm-btn adm-btn-primary" disabled={pending} onClick={() => persist(draft, () => setDraft({ menu_id: menuId, parent_id: null, label: "", link_type: "url", link_ref: "", column_group: "", position: 99, is_active: true }))}>+ Agregar</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveSizeGuide, deleteRow } from "@/app/admin/(panel)/catalog.actions";

type Cat = { id: string; name: string };
type Guide = { id?: string; name: string; category_id: string | null; columns: string[]; rows: string[][]; is_active: boolean };

function blankGuide(): Guide {
  return { name: "Nueva guía", category_id: null, columns: ["Talle", "Cintura (cm)", "Cadera (cm)", "Largo (cm)"], rows: [["", "", "", ""]], is_active: true };
}

function GuideCard({ initial, categories, onSaved }: { initial: Guide; categories: Cat[]; onSaved: () => void }) {
  const router = useRouter();
  const [g, setG] = useState<Guide>(initial);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const setCol = (i: number, v: string) => setG((s) => ({ ...s, columns: s.columns.map((c, idx) => (idx === i ? v : c)) }));
  const addCol = () => setG((s) => ({ ...s, columns: [...s.columns, ""], rows: s.rows.map((r) => [...r, ""]) }));
  const delCol = (i: number) => setG((s) => ({ ...s, columns: s.columns.filter((_, idx) => idx !== i), rows: s.rows.map((r) => r.filter((_, idx) => idx !== i)) }));
  const setCell = (r: number, c: number, v: string) => setG((s) => ({ ...s, rows: s.rows.map((row, ri) => (ri === r ? row.map((cell, ci) => (ci === c ? v : cell)) : row)) }));
  const addRow = () => setG((s) => ({ ...s, rows: [...s.rows, s.columns.map(() => "")] }));
  const delRow = (r: number) => setG((s) => ({ ...s, rows: s.rows.filter((_, idx) => idx !== r) }));

  const save = async () => {
    setPending(true); setMsg(null);
    const res = await saveSizeGuide(g);
    setMsg(res.msg); setPending(false);
    if (res.ok) router.refresh();
  };
  const remove = async () => {
    if (!g.id) { onSaved(); return; }
    if (!confirm("¿Eliminar esta guía?")) return;
    setPending(true);
    await deleteRow("size_guides", g.id);
    router.refresh();
  };

  return (
    <div className="adm-card" style={{ marginBottom: 20 }}>
      {msg && <div className="adm-msg ok">{msg}</div>}
      <div className="adm-row2">
        <div className="adm-field"><label>Nombre de la guía</label><input className="adm-input" value={g.name} onChange={(e) => setG((s) => ({ ...s, name: e.target.value }))} /></div>
        <div className="adm-field"><label>Categoría</label>
          <select className="adm-select" value={g.category_id ?? ""} onChange={(e) => setG((s) => ({ ...s, category_id: e.target.value || null }))}>
            <option value="">— General (sin categoría) —</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div style={{ overflowX: "auto", marginTop: 8 }}>
        <table className="adm-matrix">
          <thead>
            <tr>
              {g.columns.map((c, i) => (
                <th key={i} style={{ minWidth: 120 }}>
                  <input className="adm-input" style={{ fontSize: 12, padding: "6px 8px" }} value={c} onChange={(e) => setCol(i, e.target.value)} />
                  {g.columns.length > 1 && <button type="button" onClick={() => delCol(i)} title="Quitar columna" style={{ background: "none", border: 0, color: "var(--rojo)", cursor: "pointer", fontSize: 11, marginTop: 4 }}>✕ col</button>}
                </th>
              ))}
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {g.rows.map((row, r) => (
              <tr key={r}>
                {g.columns.map((_, c) => (
                  <td key={c}><input value={row[c] ?? ""} onChange={(e) => setCell(r, c, e.target.value)} style={{ width: "100%" }} /></td>
                ))}
                <td><button type="button" onClick={() => delRow(r)} title="Quitar fila" style={{ background: "none", border: 0, color: "var(--rojo)", cursor: "pointer" }}>✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        <button type="button" className="adm-btn" onClick={addRow}>+ Fila</button>
        <button type="button" className="adm-btn" onClick={addCol}>+ Columna</button>
        <label className="adm-check" style={{ marginLeft: 6 }}><input type="checkbox" checked={g.is_active} onChange={(e) => setG((s) => ({ ...s, is_active: e.target.checked }))} /> Activa</label>
        <span style={{ flex: 1 }} />
        <button type="button" className="adm-btn adm-btn-primary" disabled={pending} onClick={save}>{pending ? "Guardando…" : "Guardar guía"}</button>
        <button type="button" className="adm-btn adm-btn-danger" disabled={pending} onClick={remove}>Eliminar</button>
      </div>
    </div>
  );
}

export default function SizeGuidesEditor({ guides, categories }: { guides: Guide[]; categories: Cat[] }) {
  const [extra, setExtra] = useState<Guide[]>([]);
  const all = [...guides, ...extra];

  return (
    <>
      <div className="adm-head">
        <div><h1>Guía de talles</h1><p>Editá la tabla de medidas de cada categoría. Se muestra en la ficha de producto.</p></div>
        <button className="adm-btn adm-btn-primary" onClick={() => setExtra((e) => [...e, blankGuide()])}>+ Nueva guía</button>
      </div>
      {all.length === 0 && <div className="adm-notice">No hay guías todavía. Creá una con “+ Nueva guía”.</div>}
      {all.map((g, i) => (
        <GuideCard key={g.id ?? `new-${i}`} initial={g} categories={categories} onSaved={() => setExtra((e) => e.filter((_, idx) => `new-${guides.length + idx}` !== `new-${i}`))} />
      ))}
    </>
  );
}

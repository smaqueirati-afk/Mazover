"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteRow, type Res } from "@/app/admin/(panel)/catalog.actions";

export type Field = { key: string; label: string; type?: "text" | "number" | "bool" | "color" };
type Row = Record<string, string | number | boolean | undefined>;

export default function CatalogCrud({
  title, subtitle, table, fields, rows, save, newDefaults,
}: {
  title: string;
  subtitle: string;
  table: string;
  fields: Field[];
  rows: Row[];
  save: (input: Row) => Promise<Res>;
  newDefaults: Row;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [items, setItems] = useState<Row[]>(rows);
  const [draft, setDraft] = useState<Row>(newDefaults);
  const [msg, setMsg] = useState<string | null>(null);

  const editRow = (i: number, key: string, val: string | number | boolean) =>
    setItems((prev) => prev.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));

  const persist = (row: Row, reset?: () => void) =>
    start(async () => {
      const r = await save(row);
      setMsg(r.msg);
      if (r.ok) { reset?.(); router.refresh(); }
    });

  const remove = (id: string) =>
    start(async () => { await deleteRow(table, id); router.refresh(); });

  const renderInput = (row: Row, key: string, type: Field["type"], onChange: (v: string | number | boolean) => void) => {
    const v = row[key];
    if (type === "bool") return <input type="checkbox" checked={!!v} onChange={(e) => onChange(e.target.checked)} />;
    if (type === "color") return (
      <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <input type="color" value={String(v ?? "#000000")} onChange={(e) => onChange(e.target.value)} style={{ width: 36, height: 32 }} />
        <input className="adm-input" style={{ width: 100 }} value={String(v ?? "")} onChange={(e) => onChange(e.target.value)} />
      </span>
    );
    return <input className="adm-input" type={type === "number" ? "number" : "text"} value={String(v ?? "")} onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)} />;
  };

  return (
    <>
      <div className="adm-head"><div><h1>{title}</h1><p>{subtitle}</p></div></div>
      {msg && <div className="adm-msg ok">{msg}</div>}
      <table className="adm-table">
        <thead><tr>{fields.map((f) => <th key={f.key}>{f.label}</th>)}<th></th></tr></thead>
        <tbody>
          {items.map((row, i) => (
            <tr key={String(row.id)}>
              {fields.map((f) => <td key={f.key}>{renderInput(row, f.key, f.type, (v) => editRow(i, f.key, v))}</td>)}
              <td style={{ display: "flex", gap: 6 }}>
                <button className="adm-btn" disabled={pending} onClick={() => persist(row)}>Guardar</button>
                <button className="adm-btn adm-btn-danger" disabled={pending} onClick={() => remove(String(row.id))}>✕</button>
              </td>
            </tr>
          ))}
          {/* fila nueva */}
          <tr>
            {fields.map((f) => <td key={f.key}>{renderInput(draft, f.key, f.type, (v) => setDraft((d) => ({ ...d, [f.key]: v })))}</td>)}
            <td>
              <button className="adm-btn adm-btn-primary" disabled={pending} onClick={() => persist(draft, () => setDraft(newDefaults))}>+ Agregar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

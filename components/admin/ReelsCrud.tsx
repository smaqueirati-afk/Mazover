"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { saveReel } from "@/app/admin/(panel)/catalog.actions";
import { deleteRow } from "@/app/admin/(panel)/catalog.actions";

type Reel = { id?: string; instagram_url: string; poster_url: string | null; caption: string | null; product_id: string | null; position: number; is_active: boolean };

export default function ReelsCrud({ rows, products }: { rows: Reel[]; products: { id: string; name: string }[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [items, setItems] = useState<Reel[]>(rows);
  const [draft, setDraft] = useState<Reel>({ instagram_url: "", poster_url: null, caption: "", product_id: null, position: rows.length + 1, is_active: true });
  const [msg, setMsg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const edit = (i: number, patch: Partial<Reel>) => setItems((p) => p.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const persist = (r: Reel, reset?: () => void) => start(async () => {
    if (!r.instagram_url) { setMsg("Falta el link del reel."); return; }
    const res = await saveReel(r); setMsg(res.msg); if (res.ok) { reset?.(); router.refresh(); }
  });
  const remove = (id: string) => start(async () => { await deleteRow("instagram_reels", id); router.refresh(); });

  async function uploadPoster(file: File, apply: (url: string) => void) {
    setUploading(true); setMsg(null);
    try {
      const supabase = createClient();
      // eslint-disable-next-line react-hooks/purity -- Date.now() en event handler (subida), no en render
      const path = `reels/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error } = await supabase.storage.from("content").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("content").getPublicUrl(path);
      apply(data.publicUrl);
    } catch (e) { setMsg(e instanceof Error ? e.message : "Error al subir el poster."); }
    finally { setUploading(false); }
  }

  const renderFields = (r: Reel, onChange: (p: Partial<Reel>) => void) => (
    <>
      <td style={{ minWidth: 220 }}><input className="adm-input" placeholder="https://instagram.com/reel/…" value={r.instagram_url} onChange={(e) => onChange({ instagram_url: e.target.value })} /></td>
      <td><input className="adm-input" placeholder="Copy" value={r.caption ?? ""} onChange={(e) => onChange({ caption: e.target.value })} /></td>
      <td>
        <select className="adm-select" value={r.product_id ?? ""} onChange={(e) => onChange({ product_id: e.target.value || null })}>
          <option value="">Sin producto</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </td>
      <td><input type="checkbox" checked={r.is_active} onChange={(e) => onChange({ is_active: e.target.checked })} /></td>
    </>
  );

  return (
    <>
      <div className="adm-head"><div><h1>Reels de Instagram</h1><p>Videos de la marca mostrando las prendas. Enlazá el reel y, opcionalmente, un producto.</p></div></div>
      {msg && <div className="adm-msg ok">{msg}</div>}
      <table className="adm-table">
        <thead><tr><th>Poster</th><th>Link del reel</th><th>Copy</th><th>Producto</th><th>Activo</th><th></th></tr></thead>
        <tbody>
          {items.map((r, i) => (
            <tr key={r.id}>
              <td>
                {r.poster_url ? <img className="thumb" src={r.poster_url} alt="" /> : <div className="thumb" />}
                <label className="adm-btn" style={{ padding: "3px 6px", fontSize: 10, marginTop: 4, cursor: "pointer", display: "block" }}>
                  {uploading ? "…" : "Poster"}
                  <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPoster(f, (url) => edit(i, { poster_url: url })); }} />
                </label>
              </td>
              {renderFields(r, (p) => edit(i, p))}
              <td style={{ display: "flex", gap: 6 }}>
                <button className="adm-btn" disabled={pending} onClick={() => persist(r)}>Guardar</button>
                <button className="adm-btn adm-btn-danger" disabled={pending} onClick={() => remove(r.id!)}>✕</button>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              {draft.poster_url ? <img className="thumb" src={draft.poster_url} alt="" /> : <div className="thumb" />}
              <label className="adm-btn" style={{ padding: "3px 6px", fontSize: 10, marginTop: 4, cursor: "pointer", display: "block" }}>
                {uploading ? "…" : "Poster"}
                <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPoster(f, (url) => setDraft((d) => ({ ...d, poster_url: url }))); }} />
              </label>
            </td>
            {renderFields(draft, (p) => setDraft((d) => ({ ...d, ...p })))}
            <td><button className="adm-btn adm-btn-primary" disabled={pending} onClick={() => persist(draft, () => setDraft({ instagram_url: "", poster_url: null, caption: "", product_id: null, position: items.length + 2, is_active: true }))}>+ Agregar</button></td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

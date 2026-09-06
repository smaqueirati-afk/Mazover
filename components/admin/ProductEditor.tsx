"use client";

/* eslint-disable @next/next/no-img-element */
import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AdminProduct } from "@/lib/admin";
import {
  upsertProductInfo, deleteProduct, addColor, deleteColor,
  saveStock, attachImage, deleteImage, setCover, type ActionState,
} from "@/app/admin/(panel)/productos/actions";

type Tax = {
  categories: { id: string; name: string }[];
  fits: { id: string; name: string }[];
  sizes: { id: string; label: string; position: number }[];
  colors: { id: string; name: string; hex: string }[];
};

const TABS = ["Info", "Colores", "Stock", "Imágenes", "SEO"] as const;
type Tab = (typeof TABS)[number];

export default function ProductEditor({ product, tax }: { product: AdminProduct | null; tax: Tax }) {
  const [tab, setTab] = useState<Tab>("Info");
  const [state, action, pending] = useActionState<ActionState, FormData>(upsertProductInfo, null);
  const isNew = !product;

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>{isNew ? "Nuevo producto" : product!.name}</h1>
          <p>{isNew ? "Cargá la información y guardá para habilitar colores, stock e imágenes." : "Editá información, colores, stock e imágenes."}</p>
        </div>
        {!isNew && (
          <button className="adm-btn adm-btn-danger" onClick={() => { if (confirm("¿Eliminar este producto?")) deleteProduct(product!.id); }}>
            Eliminar
          </button>
        )}
      </div>

      <div className="adm-tabs">
        {TABS.map((t) => {
          const locked = isNew && t !== "Info" && t !== "SEO";
          return (
            <button
              key={t}
              className={`adm-tab ${tab === t ? "on" : ""}`}
              onClick={() => setTab(t)}
              disabled={locked}
              title={locked ? "Guardá la información primero para habilitar esta pestaña" : undefined}
            >
              {t}{locked ? " 🔒" : ""}
            </button>
          );
        })}
      </div>
      {isNew && (
        <p className="adm-tabs-hint">🔒 Guardá la <strong>Info</strong> para habilitar Colores, Stock e Imágenes.</p>
      )}

      {/* INFO + SEO comparten un form */}
      <form action={action}>
        <input type="hidden" name="id" defaultValue={product?.id ?? ""} />
        {state && <div className={`adm-msg ${state.ok ? "ok" : "err"}`}>{state.msg}</div>}

        <div hidden={tab !== "Info"}>
          <div className="adm-card" style={{ marginBottom: 20 }}>
            <div className="adm-row2">
              <div className="adm-field"><label>Nombre</label><input name="name" className="adm-input" defaultValue={product?.name ?? ""} required /></div>
              <div className="adm-field"><label>Slug (URL)</label><input name="slug" className="adm-input" defaultValue={product?.slug ?? ""} placeholder="se genera del nombre" /></div>
            </div>
            <div className="adm-field"><label>Descripción corta</label><input name="short_description" className="adm-input" defaultValue={product?.short_description ?? ""} /></div>
            <div className="adm-field"><label>Descripción completa</label><textarea name="description" className="adm-textarea" defaultValue={product?.description ?? ""} /></div>
            <div className="adm-row2">
              <div className="adm-field"><label>Categoría</label>
                <select name="category_id" className="adm-select" defaultValue={product?.category_id ?? ""}>
                  <option value="">—</option>
                  {tax.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="adm-field"><label>Corte</label>
                <select name="fit_id" className="adm-select" defaultValue={product?.fit_id ?? ""}>
                  <option value="">—</option>
                  {tax.fits.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div className="adm-field"><label>Composición</label><input name="composition" className="adm-input" defaultValue={product?.composition ?? ""} placeholder="100% algodón · 14.5 oz" /></div>
              <div className="adm-field"><label>Orden</label><input name="position" type="number" className="adm-input" defaultValue={product?.position ?? 0} /></div>
              <div className="adm-field"><label>Precio</label><input name="price" type="number" step="0.01" className="adm-input" defaultValue={product?.price ?? 0} /></div>
              <div className="adm-field"><label>Precio anterior (tachado)</label><input name="compare_at_price" type="number" step="0.01" className="adm-input" defaultValue={product?.compare_at_price ?? ""} /></div>
            </div>
            <div style={{ display: "flex", gap: 22, flexWrap: "wrap", marginTop: 8 }}>
              <label className="adm-check"><input type="checkbox" name="is_active" defaultChecked={product?.is_active ?? true} /> Activo</label>
              <label className="adm-check"><input type="checkbox" name="is_featured" defaultChecked={product?.is_featured ?? false} /> Destacado</label>
              <label className="adm-check"><input type="checkbox" name="is_new" defaultChecked={product?.is_new ?? false} /> Nuevo</label>
              <label className="adm-check"><input type="checkbox" name="is_bestseller" defaultChecked={product?.is_bestseller ?? false} /> Best seller</label>
            </div>
          </div>
        </div>

        <div hidden={tab !== "SEO"}>
          <div className="adm-card" style={{ marginBottom: 20 }}>
            <div className="adm-field"><label>Título SEO</label><input name="seo_title" className="adm-input" defaultValue={product?.seo_title ?? ""} /></div>
            <div className="adm-field"><label>Descripción SEO</label><textarea name="seo_description" className="adm-textarea" defaultValue={product?.seo_description ?? ""} /></div>
            <p style={{ fontSize: 12, color: "var(--gris)" }}>URL del producto: <code>/productos/{product?.slug ?? "(slug)"}</code></p>
          </div>
        </div>

        {(tab === "Info" || tab === "SEO") && (
          <button className="adm-btn adm-btn-primary" disabled={pending}>{pending ? "Guardando…" : "Guardar producto"}</button>
        )}
      </form>

      {!isNew && tab === "Colores" && <ColorsPanel product={product!} palette={tax.colors} />}
      {!isNew && tab === "Stock" && <StockPanel product={product!} sizes={tax.sizes} />}
      {!isNew && tab === "Imágenes" && <ImagesPanel product={product!} />}
    </>
  );
}

/* ---------------- Colores ---------------- */
function ColorsPanel({ product, palette }: { product: AdminProduct; palette: { id: string; name: string; hex: string }[] }) {
  const [pending, start] = useTransition();
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#1E3B63");
  const [sku, setSku] = useState("");
  const router = useRouter();

  return (
    <div className="adm-card">
      <h3 style={{ fontFamily: "var(--oswald)", textTransform: "uppercase", marginBottom: 16 }}>Colores del producto</h3>
      <table className="adm-table" style={{ marginBottom: 20 }}>
        <thead><tr><th>Muestra</th><th>Nombre</th><th>Hex</th><th>SKU base</th><th>Activo</th><th></th></tr></thead>
        <tbody>
          {product.colors.map((c) => (
            <tr key={c.id}>
              <td><span style={{ display: "inline-block", width: 22, height: 22, borderRadius: "50%", background: c.hex, border: "1px solid #ccc" }} /></td>
              <td>{c.name}</td>
              <td>{c.hex}</td>
              <td>{c.sku_base ?? "—"}</td>
              <td>{c.is_active ? <span className="adm-pill ok">Sí</span> : <span className="adm-pill off">No</span>}</td>
              <td><button className="adm-btn adm-btn-danger" disabled={pending} onClick={() => start(async () => { await deleteColor(c.id, product.id); router.refresh(); })}>Quitar</button></td>
            </tr>
          ))}
          {product.colors.length === 0 && <tr><td colSpan={6} style={{ color: "var(--gris)" }}>Sin colores todavía.</td></tr>}
        </tbody>
      </table>

      <h4 style={{ fontFamily: "var(--oswald)", textTransform: "uppercase", fontSize: 13, marginBottom: 10 }}>Agregar color</h4>
      <div className="adm-row2" style={{ alignItems: "end" }}>
        <div className="adm-field"><label>Desde paleta</label>
          <select className="adm-select" onChange={(e) => { const c = palette.find((p) => p.id === e.target.value); if (c) { setName(c.name); setHex(c.hex); } }}>
            <option value="">— Elegir —</option>
            {palette.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="adm-field"><label>Nombre</label><input className="adm-input" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="adm-field"><label>Hex</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} style={{ width: 44, height: 40 }} />
            <input className="adm-input" value={hex} onChange={(e) => setHex(e.target.value)} />
          </div>
        </div>
        <div className="adm-field"><label>SKU base</label><input className="adm-input" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="JEAN-REL-IND" /></div>
      </div>
      <button className="adm-btn adm-btn-primary" disabled={pending || !name} onClick={() => start(async () => { await addColor(product.id, name, hex, sku); setName(""); setSku(""); router.refresh(); })}>
        Agregar color
      </button>
    </div>
  );
}

/* ---------------- Stock (matriz) ---------------- */
function StockPanel({ product, sizes }: { product: AdminProduct; sizes: { id: string; label: string }[] }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  const [grid, setGrid] = useState<Record<string, number>>(() => {
    const g: Record<string, number> = {};
    for (const c of product.colors) for (const v of c.variants) g[`${c.id}:${v.size_id}`] = v.stock;
    return g;
  });
  const [msg, setMsg] = useState<string | null>(null);

  if (product.colors.length === 0) return <div className="adm-notice">Agregá al menos un color en la pestaña Colores.</div>;
  if (sizes.length === 0) return <div className="adm-notice">Cargá talles en la sección Talles.</div>;

  const save = () => start(async () => {
    const rows = [] as { product_color_id: string; size_id: string; stock: number; sku: string | null }[];
    for (const c of product.colors) for (const s of sizes) {
      const stock = grid[`${c.id}:${s.id}`] ?? 0;
      rows.push({ product_color_id: c.id, size_id: s.id, stock, sku: c.sku_base ? `${c.sku_base}-${s.label}` : null });
    }
    const r = await saveStock(product.id, rows);
    setMsg(r.ok ? "Stock guardado." : r.msg);
    router.refresh();
  });

  return (
    <div className="adm-card">
      <h3 style={{ fontFamily: "var(--oswald)", textTransform: "uppercase", marginBottom: 16 }}>Stock por color × talle</h3>
      {msg && <div className="adm-msg ok">{msg}</div>}
      <div style={{ overflowX: "auto" }}>
        <table className="adm-matrix">
          <thead><tr><th>Color</th>{sizes.map((s) => <th key={s.id}>{s.label}</th>)}</tr></thead>
          <tbody>
            {product.colors.map((c) => (
              <tr key={c.id}>
                <td className="rowlabel">{c.name}</td>
                {sizes.map((s) => {
                  const key = `${c.id}:${s.id}`;
                  return (
                    <td key={s.id}>
                      <input type="number" min={0} value={grid[key] ?? 0}
                        onChange={(e) => setGrid((g) => ({ ...g, [key]: Math.max(0, Number(e.target.value)) }))} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="adm-btn adm-btn-primary" style={{ marginTop: 16 }} disabled={pending} onClick={save}>
        {pending ? "Guardando…" : "Guardar stock"}
      </button>
    </div>
  );
}

/* ---------------- Imágenes ---------------- */
function ImagesPanel({ product }: { product: AdminProduct }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  const [uploading, setUploading] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  if (product.colors.length === 0) return <div className="adm-notice">Agregá al menos un color para subir imágenes.</div>;

  async function upload(colorId: string, file: File, isCover: boolean) {
    setErr(null); setUploading(colorId);
    try {
      const supabase = createClient();
      // eslint-disable-next-line react-hooks/purity -- Date.now() en event handler (subida), no en render
      const path = `${product.id}/${colorId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error } = await supabase.storage.from("products").upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("products").getPublicUrl(path);
      await attachImage(product.id, colorId, data.publicUrl, isCover);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error al subir. ¿Creaste el bucket 'products'?");
    } finally {
      setUploading(null);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {err && <div className="adm-msg err">{err}</div>}
      {product.colors.map((c) => (
        <div className="adm-card" key={c.id}>
          <h3 style={{ fontFamily: "var(--oswald)", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 18, height: 18, borderRadius: "50%", background: c.hex, border: "1px solid #ccc" }} /> {c.name}
          </h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
            {c.images.map((im) => (
              <div key={im.id} style={{ width: 110 }}>
                <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", borderRadius: 4, border: im.is_cover ? "2px solid var(--rojo)" : "1px solid #ddd" }}>
                  <img src={im.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  {!im.is_cover && <button className="adm-btn" style={{ padding: "4px 8px", fontSize: 10 }} disabled={pending} onClick={() => start(async () => { await setCover(im.id, c.id, product.id); router.refresh(); })}>Portada</button>}
                  <button className="adm-btn adm-btn-danger" style={{ padding: "4px 8px", fontSize: 10 }} disabled={pending} onClick={() => start(async () => { await deleteImage(im.id, product.id); router.refresh(); })}>✕</button>
                </div>
              </div>
            ))}
            {c.images.length === 0 && <p style={{ color: "var(--gris)", fontSize: 13 }}>Sin imágenes.</p>}
          </div>
          <label className="adm-btn" style={{ cursor: "pointer" }}>
            {uploading === c.id ? "Subiendo…" : "+ Subir imagen"}
            <input type="file" accept="image/*" hidden disabled={uploading === c.id}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(c.id, f, c.images.length === 0); e.target.value = ""; }} />
          </label>
        </div>
      ))}
    </div>
  );
}

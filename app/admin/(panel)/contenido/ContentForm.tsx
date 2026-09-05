"use client";

/* eslint-disable @next/next/no-img-element */
import { useActionState, useState } from "react";
import { updateContent, type ActionState } from "./actions";
import { createClient } from "@/lib/supabase/client";

export type Block = {
  key: string;
  section: string;
  label: string | null;
  type: string;
  value: string | null;
  image_url: string | null;
};

const SECTION_LABELS: Record<string, string> = {
  home_hero: "Home · Hero",
  home_marquee: "Home · Franja",
  home_philo: "Home · Filosofía",
  home_band: "Home · Banda",
  home_collection: "Home · Colección",
  home_reels: "Home · Reels",
  home_made: "Home · Hecho en Argentina",
  home_frases: "Home · Frases de marca",
  home_cta: "Home · CTA final",
  home_features: "Home · Features",
  home_specs: "Home · Especificaciones",
  page_lamarca: "Página · La Marca",
  page_hecho: "Página · Hecho en Argentina",
  producto: "Detalle de producto",
  footer: "Footer",
  general: "General",
};

// Tamaño recomendado por imagen, según cómo se usa en el sitio.
const SIZE_HINTS: Record<string, string> = {
  "home.hero.image": "Vertical · ~1600×2000 px (4:5) — figura de cuerpo entero, buena luz",
  "home.philo.image": "Vertical · 1200×1500 px (4:5) — textura/detalle de denim",
  "home.philo.detail": "Cuadrada · 800×800 px (1:1) — detalle (botón, etiqueta)",
  "home.band.image": "Apaisada · 1920×900 px (panorámica) — detalle de confección",
  "home.made.image_a": "Apaisada · 1600×1000 px (16:10) — taller",
  "home.made.image_b1": "Apaisada · 1200×675 px (16:9)",
  "home.made.image_b2": "Apaisada · 1200×675 px (16:9)",
  "lamarca.hero.image": "Vertical · 1200×1500 px (4:5)",
  "lamarca.s1.image": "Vertical · 1200×1500 px (4:5)",
  "lamarca.s2.image": "Vertical · 1200×1500 px (4:5)",
  "hecho.hero.image": "Apaisada · 1920×1000 px — foto de fondo del encabezado",
  "hecho.b1.image": "Apaisada · 1200×900 px (4:3)",
  "hecho.b2.image": "Apaisada · 1200×900 px (4:3)",
  "hecho.b3.image": "Apaisada · 1200×900 px (4:3)",
};
const DEFAULT_HINT = "Mín. 1200 px de ancho · JPG o WEBP livianas";

export default function ContentForm({ blocks }: { blocks: Block[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateContent, null);
  const [imgs, setImgs] = useState<Record<string, string>>(() =>
    Object.fromEntries(blocks.filter((b) => b.type === "image").map((b) => [b.key, b.image_url ?? ""]))
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function uploadImg(key: string, file: File) {
    setErr(null);
    setBusy(key);
    try {
      const supabase = createClient();
      // eslint-disable-next-line react-hooks/purity -- Date.now() en event handler (subida), no en render
      const path = `content/${key}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error } = await supabase.storage.from("content").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("content").getPublicUrl(path);
      setImgs((m) => ({ ...m, [key]: data.publicUrl }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "No se pudo subir la imagen.");
    } finally {
      setBusy(null);
    }
  }

  const sections = new Map<string, Block[]>();
  for (const b of blocks) {
    if (!sections.has(b.section)) sections.set(b.section, []);
    sections.get(b.section)!.push(b);
  }

  return (
    <form action={action}>
      <input type="hidden" name="__keys" value={JSON.stringify(blocks.map((b) => b.key))} />
      {state && <div className={`adm-msg ${state.ok ? "ok" : "err"}`}>{state.msg}</div>}
      {err && <div className="adm-msg err">{err}</div>}

      <div style={{ position: "sticky", top: 0, background: "#f3f3f0", padding: "10px 0 16px", zIndex: 5 }}>
        <button className="adm-btn adm-btn-primary" disabled={pending}>
          {pending ? "Guardando…" : "Guardar todo el contenido"}
        </button>
      </div>

      {[...sections.entries()].map(([section, items]) => (
        <div className="adm-card" style={{ marginBottom: 20 }} key={section}>
          <h3 style={{ fontFamily: "var(--oswald)", textTransform: "uppercase", marginBottom: 16 }}>
            {SECTION_LABELS[section] ?? section}
          </h3>
          {items.map((b) => (
            <div className="adm-field" key={b.key}>
              <label>{b.label ?? b.key}</label>
              {b.type === "image" ? (
                <>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ width: 64, height: 64, borderRadius: 6, background: "#eee", overflow: "hidden", flex: "none" }}>
                    {imgs[b.key] && <img src={imgs[b.key]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>
                  <input
                    name={`${b.key}__img`}
                    className="adm-input"
                    style={{ flex: 1, minWidth: 200 }}
                    value={imgs[b.key] ?? ""}
                    onChange={(e) => setImgs((m) => ({ ...m, [b.key]: e.target.value }))}
                    placeholder="/demo/… o subí una imagen"
                  />
                  <label className="adm-btn" style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                    {busy === b.key ? "Subiendo…" : "Subir imagen"}
                    <input type="file" accept="image/*" hidden disabled={busy === b.key}
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImg(b.key, f); e.target.value = ""; }} />
                  </label>
                </div>
                <div style={{ fontSize: 12, color: "var(--gris)", marginTop: 6 }}>📐 Tamaño recomendado: {SIZE_HINTS[b.key] ?? DEFAULT_HINT}</div>
                </>
              ) : (b.type === "richtext" || (b.value?.length ?? 0) > 70) ? (
                <textarea name={b.key} className="adm-textarea" defaultValue={b.value ?? ""} />
              ) : (
                <input name={b.key} className="adm-input" defaultValue={b.value ?? ""} />
              )}
            </div>
          ))}
        </div>
      ))}
    </form>
  );
}

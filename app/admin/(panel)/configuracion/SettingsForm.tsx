"use client";

import { useActionState, useState } from "react";
import { updateSettings, type ActionState } from "./actions";
import type { Settings } from "@/lib/types";
import { PALETTES } from "@/lib/palettes";

function Field({ name, label, def, type = "text", full }: { name: string; label: string; def: string; type?: string; full?: boolean }) {
  return (
    <div className="adm-field" style={full ? { gridColumn: "1 / -1" } : undefined}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} className="adm-input" type={type} defaultValue={def} />
    </div>
  );
}

export default function SettingsForm({ settings }: { settings: Settings }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateSettings, null);
  const [pal, setPal] = useState(settings.palette || "heritage");

  return (
    <form action={action}>
      {state && <div className={`adm-msg ${state.ok ? "ok" : "err"}`}>{state.msg}</div>}

      <div className="adm-card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "var(--oswald)", textTransform: "uppercase", marginBottom: 16 }}>Marca</h3>
        <div className="adm-row2">
          <Field name="brand_name" label="Nombre de marca" def={settings.brand_name} />
          <Field name="brand_tagline" label="Bajada / claim" def={settings.brand_tagline} />
          <Field name="logo_url" label="Logo (URL, opcional)" def={settings.logo_url ?? ""} full />
        </div>
      </div>

      <div className="adm-card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "var(--oswald)", textTransform: "uppercase", marginBottom: 16 }}>Contacto</h3>
        <div className="adm-row2">
          <Field name="whatsapp_number" label="WhatsApp (con código país, sin +)" def={settings.whatsapp_number ?? ""} />
          <Field name="whatsapp_message" label="Mensaje inicial de WhatsApp" def={settings.whatsapp_message ?? ""} />
          <Field name="instagram_url" label="Instagram (URL)" def={settings.instagram_url ?? ""} />
          <Field name="instagram_handle" label="Instagram (handle)" def={settings.instagram_handle ?? ""} />
          <Field name="email" label="Email" def={settings.email ?? ""} type="email" />
          <Field name="address" label="Dirección" def={settings.address ?? ""} />
        </div>
      </div>

      <div className="adm-card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "var(--oswald)", textTransform: "uppercase", marginBottom: 6 }}>Paleta de colores</h3>
        <p style={{ fontSize: 13, color: "var(--gris)", marginBottom: 16 }}>Elegí una combinación. Se aplica a todo el sitio al guardar.</p>
        <input type="hidden" name="palette" value={pal} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
          {PALETTES.map((p) => {
            const t = p.tokens;
            const active = pal === p.key;
            return (
              <button type="button" key={p.key} onClick={() => setPal(p.key)} aria-pressed={active}
                style={{ textAlign: "left", cursor: "pointer", padding: 0, border: `2px solid ${active ? "var(--azul-profundo)" : "rgba(13,19,38,.15)"}`, borderRadius: 10, overflow: "hidden", background: "#fff", boxShadow: active ? "0 6px 18px -10px rgba(13,19,38,.5)" : "none" }}>
                <div style={{ display: "flex", height: 46 }}>
                  <span style={{ flex: 2, background: t.noche }} />
                  <span style={{ flex: 1, background: t.papel }} />
                  <span style={{ flex: 1, background: t.azul }} />
                  <span style={{ flex: 1, background: t.rojo }} />
                  <span style={{ flex: 1, background: t.arena }} />
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ fontFamily: "var(--oswald)", textTransform: "uppercase", fontSize: 13, letterSpacing: ".04em", color: "var(--azul-profundo)" }}>
                    {p.name}{active ? " ✓" : ""}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--gris)", marginTop: 3, lineHeight: 1.4 }}>{p.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="adm-card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "var(--oswald)", textTransform: "uppercase", marginBottom: 16 }}>SEO global</h3>
        <Field name="seo_title" label="Título SEO" def={settings.seo_title ?? ""} full />
        <Field name="seo_description" label="Descripción SEO" def={settings.seo_description ?? ""} full />
        <Field name="currency_symbol" label="Símbolo de moneda" def={settings.currency_symbol} />
      </div>

      <button className="adm-btn adm-btn-primary" disabled={pending}>
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}

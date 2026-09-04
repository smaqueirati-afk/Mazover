"use client";

import { useActionState } from "react";
import { updateSettings, type ActionState } from "./actions";
import type { Settings } from "@/lib/types";

function Field({ name, label, def, type = "text", full }: { name: string; label: string; def: string; type?: string; full?: boolean }) {
  return (
    <div className="adm-field" style={full ? { gridColumn: "1 / -1" } : undefined}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} className="adm-input" type={type} defaultValue={def} />
    </div>
  );
}

const COLORS: { name: keyof Settings; label: string }[] = [
  { name: "color_ink", label: "Azul profundo (base)" },
  { name: "color_blue", label: "Azul" },
  { name: "color_celeste", label: "Celeste" },
  { name: "color_surface", label: "Fondo (hueso)" },
  { name: "color_sand", label: "Arena" },
  { name: "color_red", label: "Rojo (logo/acento)" },
];

export default function SettingsForm({ settings }: { settings: Settings }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateSettings, null);

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
        <h3 style={{ fontFamily: "var(--oswald)", textTransform: "uppercase", marginBottom: 16 }}>Paleta</h3>
        <div className="adm-row2">
          {COLORS.map((c) => (
            <div className="adm-field" key={c.name}>
              <label htmlFor={c.name}>{c.label}</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="color" defaultValue={String(settings[c.name] ?? "#000000")} onChange={(e) => {
                  const t = document.getElementById(`${c.name}_txt`) as HTMLInputElement | null;
                  if (t) t.value = e.target.value;
                }} style={{ width: 44, height: 40, border: "1px solid rgba(13,19,38,.2)", borderRadius: 4, background: "#fff" }} />
                <input id={`${c.name}_txt`} name={c.name} className="adm-input" defaultValue={String(settings[c.name] ?? "")} />
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "var(--gris)", marginTop: 6 }}>Los colores se aplican en todo el sitio al guardar.</p>
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

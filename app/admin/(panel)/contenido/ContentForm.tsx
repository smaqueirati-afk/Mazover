"use client";

import { useActionState } from "react";
import { updateContent, type ActionState } from "./actions";

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
  footer: "Footer",
  general: "General",
};

export default function ContentForm({ blocks }: { blocks: Block[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateContent, null);

  const sections = new Map<string, Block[]>();
  for (const b of blocks) {
    if (!sections.has(b.section)) sections.set(b.section, []);
    sections.get(b.section)!.push(b);
  }

  return (
    <form action={action}>
      <input type="hidden" name="__keys" value={JSON.stringify(blocks.map((b) => b.key))} />
      {state && <div className={`adm-msg ${state.ok ? "ok" : "err"}`}>{state.msg}</div>}

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
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  {b.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.image_url} alt="" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4, background: "#eee" }} />
                  )}
                  <input name={`${b.key}__img`} className="adm-input" defaultValue={b.image_url ?? ""} placeholder="/demo/… o URL de Storage" />
                </div>
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

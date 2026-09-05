"use client";

import { useState, useTransition } from "react";
import { notifyRestock } from "@/lib/inquiries.actions";

export default function RestockButton({
  productName,
  colorName,
  sizeLabel,
}: {
  productName: string;
  colorName: string;
  sizeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const close = () => {
    setOpen(false);
    setError(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await notifyRestock({
        productName,
        colorName,
        sizeLabel: sizeLabel || "(a confirmar)",
        name,
        contact,
      });
      if (res.ok) { setDone(res.message); setName(""); setContact(""); }
      else setError(res.message);
    });
  };

  return (
    <>
      <button type="button" className="restock-trigger" onClick={() => { setDone(null); setOpen(true); }}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
        Avisame cuando vuelva
      </button>

      {open && (
        <div className="modal-backdrop" onClick={close}>
          <div className="modal restock-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            {done ? (
              <div className="restock-ok">
                <div className="restock-ok-ico" aria-hidden="true">✓</div>
                <h3>¡Anotado!</h3>
                <p>{done}</p>
                <p className="restock-detail">{productName} · {colorName}{sizeLabel ? ` · Talle ${sizeLabel}` : ""}</p>
                <button className="btn btn-ink" onClick={close}>Cerrar</button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h3>Avisame cuando vuelva</h3>
                <p className="restock-detail">{productName} · {colorName}{sizeLabel ? ` · Talle ${sizeLabel}` : ""}</p>
                <label className="restock-field">
                  <span>Tu nombre <em>(opcional)</em></span>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
                </label>
                <label className="restock-field">
                  <span>WhatsApp o email</span>
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Ej. 11 2345 6789 o vos@email.com"
                    required
                    autoFocus
                  />
                </label>
                {error && <p className="restock-error">{error}</p>}
                <div className="restock-actions">
                  <button type="button" className="btn btn-ghost" onClick={close} disabled={pending}>Cancelar</button>
                  <button type="submit" className="btn btn-ink" disabled={pending}>
                    {pending ? "Enviando…" : "Avisame"}
                  </button>
                </div>
                <p className="restock-note">Usamos tu contacto sólo para avisarte de esta prenda.</p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

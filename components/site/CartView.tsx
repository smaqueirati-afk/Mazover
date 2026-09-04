"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Settings } from "@/lib/types";
import { useCart, itemKey } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function CartView({ settings }: { settings: Settings }) {
  const { items, setQty, remove, total, count } = useCart();
  const symbol = settings.currency_symbol;

  if (count === 0) {
    return (
      <div className="wrap" style={{ padding: "60px 0 120px", textAlign: "center" }}>
        <p className="empty-title">Tu pedido está vacío.</p>
        <Link className="btn btn-ink" href="/productos">Ver la colección</Link>
      </div>
    );
  }

  const wa = buildWhatsAppLink(settings, items);

  return (
    <div className="wrap" style={{ padding: "40px 0 120px", maxWidth: 900 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {items.map((i) => {
          const k = itemKey(i);
          return (
            <div key={k} style={{ display: "grid", gridTemplateColumns: "88px 1fr auto", gap: 18, alignItems: "center", borderBottom: "1px solid rgba(13,19,38,.12)", paddingBottom: 18 }}>
              <div style={{ aspectRatio: "4/5", background: "var(--blanco-2)", overflow: "hidden" }}>
                {i.image && <img src={i.image} alt={i.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div>
                <div className="prod-name" style={{ fontSize: 20 }}>{i.name}</div>
                <div className="prod-fit">{i.colorName} · Talle {i.sizeLabel}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                  <button className="qty-btn" onClick={() => setQty(k, i.qty - 1)} aria-label="Menos">−</button>
                  <span style={{ fontFamily: "var(--oswald)", minWidth: 20, textAlign: "center" }}>{i.qty}</span>
                  <button className="qty-btn" onClick={() => setQty(k, i.qty + 1)} aria-label="Más">+</button>
                  <button onClick={() => remove(k)} style={{ background: "none", border: 0, color: "var(--rojo)", fontFamily: "var(--oswald)", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", cursor: "pointer", marginLeft: 8 }}>Quitar</button>
                </div>
              </div>
              <div className="prod-price">{formatPrice(i.price * i.qty, { currency_symbol: symbol })}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, flexWrap: "wrap", gap: 16 }}>
        <div style={{ fontFamily: "var(--oswald)", textTransform: "uppercase", fontSize: 12, letterSpacing: ".1em", color: "var(--gris)" }}>
          Total estimado
          <div className="pdp-price" style={{ margin: "6px 0 0" }}>{formatPrice(total, { currency_symbol: symbol })}</div>
        </div>
        <a className="btn btn-primary" href={wa} target="_blank" rel="noopener noreferrer" style={{ minWidth: 260, textAlign: "center" }}>
          Finalizar pedido por WhatsApp
        </a>
      </div>
      <p className="note" style={{ textAlign: "left", marginTop: 18 }}>
        El pago y el envío se coordinan por WhatsApp. Los precios pueden actualizarse.
      </p>
    </div>
  );
}

import type { CartItem, Settings } from "./types";
import { formatPrice } from "./utils";

/** Construye el link de WhatsApp con el mensaje de consulta pre-armado. */
export function buildWhatsAppLink(
  settings: Pick<Settings, "whatsapp_number" | "whatsapp_message" | "currency_symbol">,
  items: CartItem[]
) {
  const phone = (settings.whatsapp_number ?? "").replace(/\D/g, "");
  const intro = settings.whatsapp_message ?? "Hola, quiero consultar por:";
  const lines = items.map(
    (i) =>
      `• ${i.qty} x ${i.name} — Color: ${i.colorName} · Talle: ${i.sizeLabel}`
  );
  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const totalLine =
    items.length > 0 ? `\nTotal estimado: ${formatPrice(total, settings)}` : "";
  const text = `${intro}\n${lines.join("\n")}${totalLine}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/** Consulta rápida por un solo producto (color + talle). */
export function buildProductWhatsAppLink(
  settings: Pick<Settings, "whatsapp_number" | "whatsapp_message" | "currency_symbol">,
  productName: string,
  colorName: string,
  sizeLabel: string
) {
  const phone = (settings.whatsapp_number ?? "").replace(/\D/g, "");
  const intro = settings.whatsapp_message ?? "Hola, quiero consultar por:";
  const text = `${intro}\n${productName}\nColor: ${colorName}\nTalle: ${sizeLabel}\n¿Está disponible?`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

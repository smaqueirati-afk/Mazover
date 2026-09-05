import type { CartItem, Settings } from "./types";
import { formatPrice } from "./utils";

/** Origen del sitio para armar links absolutos (para el preview con foto en WhatsApp). */
function siteBase() {
  const env = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const base = env || (typeof window !== "undefined" ? window.location.origin : "");
  return base.replace(/\/$/, "");
}

/** Construye el link de WhatsApp con el mensaje de consulta pre-armado. */
export function buildWhatsAppLink(
  settings: Pick<Settings, "whatsapp_number" | "whatsapp_message" | "currency_symbol">,
  items: CartItem[]
) {
  const phone = (settings.whatsapp_number ?? "").replace(/\D/g, "");
  const intro = settings.whatsapp_message ?? "Hola, quiero consultar por:";
  const base = siteBase();
  const lines = items.map((i) => {
    const link = base ? `\n  ${base}/productos/${i.slug}` : "";
    return `• ${i.qty} x ${i.name} — Color: ${i.colorName} · Talle: ${i.sizeLabel}${link}`;
  });
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
  sizeLabel: string,
  productSlug?: string
) {
  const phone = (settings.whatsapp_number ?? "").replace(/\D/g, "");
  const intro = settings.whatsapp_message ?? "Hola, quiero consultar por:";
  const base = siteBase();
  const linkLine = productSlug && base ? `\n${base}/productos/${productSlug}` : "";
  const text = `${intro}\n${productName}\nColor: ${colorName}\nTalle: ${sizeLabel}\n¿Está disponible?${linkLine}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

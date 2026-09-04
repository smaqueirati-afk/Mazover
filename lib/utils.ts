import type { Settings, MenuItem } from "./types";

/** Resuelve el href de un ítem de menú según su tipo. */
export function menuHref(item: Pick<MenuItem, "link_type" | "link_ref">): string {
  const ref = item.link_ref ?? "";
  switch (item.link_type) {
    case "category": return `/productos?categoria=${ref}`;
    case "fit": return `/productos?corte=${ref}`;
    case "collection": return `/productos?coleccion=${ref}`;
    case "product": return `/productos/${ref}`;
    case "page": return `/${ref}`;
    default: return ref || "#";
  }
}

/** Formatea un precio en pesos argentinos (o la moneda de settings). */
export function formatPrice(value: number, settings?: Pick<Settings, "currency_symbol">) {
  const symbol = settings?.currency_symbol ?? "$";
  return `${symbol}${new Intl.NumberFormat("es-AR").format(Math.round(value))}`;
}

/** Une clases condicionalmente. */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

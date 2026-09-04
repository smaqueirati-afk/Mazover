import type { Product } from "./types";

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type CatalogParams = {
  q?: string;
  categoria?: string;
  corte?: string;
  color?: string;
  talle?: string;
  min?: number;
  max?: number;
  orden?: string;
};

export function productMinPrice(p: Product): number {
  return p.price;
}

export function isSoldOut(p: Product): boolean {
  return p.colors.every((c) => c.variants.every((v) => v.stock <= 0));
}

export function filterProducts(products: Product[], params: CatalogParams): Product[] {
  let list = [...products];
  const q = params.q?.trim().toLowerCase();

  if (q) {
    list = list.filter((p) => {
      const hay = [
        p.name,
        p.fit?.name,
        p.category?.name,
        ...p.colors.map((c) => c.name),
        ...p.colors.map((c) => c.sku_base ?? ""),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }
  if (params.categoria)
    list = list.filter((p) => p.category && slugify(p.category.name) === params.categoria);
  if (params.corte)
    list = list.filter((p) => p.fit && slugify(p.fit.name) === params.corte);
  if (params.color)
    list = list.filter((p) => p.colors.some((c) => slugify(c.name) === params.color));
  if (params.talle)
    list = list.filter((p) =>
      p.colors.some((c) => c.variants.some((v) => v.size_label === params.talle && v.stock > 0))
    );
  if (typeof params.min === "number")
    list = list.filter((p) => p.price >= params.min!);
  if (typeof params.max === "number")
    list = list.filter((p) => p.price <= params.max!);

  switch (params.orden) {
    case "precio-asc": list.sort((a, b) => a.price - b.price); break;
    case "precio-desc": list.sort((a, b) => b.price - a.price); break;
    case "nuevos": list.sort((a, b) => Number(b.is_new) - Number(a.is_new)); break;
    default: list.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
  }
  return list;
}

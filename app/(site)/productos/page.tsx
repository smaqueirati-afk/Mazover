import type { Metadata } from "next";
import { getAllProducts, getSettings } from "@/lib/data";
import Catalog, { type CatalogOptions } from "@/components/site/Catalog";
import { slugify } from "@/lib/filter";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Colección",
  description: "Todos los jeans MAZOVER: cortes, colores y talles. Diseñados y fabricados en Argentina.",
};

function buildOptions(products: Product[]): CatalogOptions {
  const cat = new Map<string, string>();
  const fit = new Map<string, string>();
  const col = new Map<string, { name: string; hex: string }>();
  const sizes = new Map<string, number>();
  for (const p of products) {
    if (p.category) cat.set(slugify(p.category.name), p.category.name);
    if (p.fit) fit.set(slugify(p.fit.name), p.fit.name);
    for (const c of p.colors) {
      col.set(slugify(c.name), { name: c.name, hex: c.hex });
      for (const v of c.variants) if (v.size_label) sizes.set(v.size_label, v.size_position);
    }
  }
  return {
    categories: [...cat.entries()].map(([slug, name]) => ({ slug, name })),
    fits: [...fit.entries()].map(([slug, name]) => ({ slug, name })),
    colors: [...col.entries()].map(([slug, v]) => ({ slug, name: v.name, hex: v.hex })),
    sizes: [...sizes.entries()].sort((a, b) => a[1] - b[1]).map(([label]) => label),
  };
}

const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const [products, settings] = await Promise.all([getAllProducts(), getSettings()]);
  const options = buildOptions(products);

  const initial = {
    categoria: str(sp.categoria),
    corte: str(sp.corte),
    color: str(sp.color),
    talle: str(sp.talle),
    q: str(sp.q),
  };

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <span className="eyebrow">Colección</span>
          <h1>Todos los jeans</h1>
        </div>
      </section>
      <Catalog products={products} options={options} symbol={settings.currency_symbol} initial={initial} />
    </>
  );
}

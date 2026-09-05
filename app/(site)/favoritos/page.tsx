import type { Metadata } from "next";
import { getAllProducts, getSettings } from "@/lib/data";
import FavoritesView from "@/components/site/FavoritesView";

export const metadata: Metadata = {
  title: "Favoritos",
  description: "Las prendas MAZOVER que guardaste en este dispositivo.",
};

export default async function FavoritosPage() {
  const [products, settings] = await Promise.all([getAllProducts(), getSettings()]);
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <span className="eyebrow">Tu selección</span>
          <h1>Favoritos</h1>
        </div>
      </section>
      <FavoritesView products={products} symbol={settings.currency_symbol} />
    </>
  );
}

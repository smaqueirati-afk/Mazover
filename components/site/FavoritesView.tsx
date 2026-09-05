"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { useFavorites } from "@/lib/favorites";
import ProductCard from "./ProductCard";

export default function FavoritesView({
  products,
  symbol,
}: {
  products: Product[];
  symbol: string;
}) {
  const { slugs, ready, clear } = useFavorites();

  if (!ready) {
    return <div className="wrap" style={{ padding: "40px 0", color: "var(--gris)" }}>Cargando tus favoritos…</div>;
  }

  // Respeta el orden en que se fueron guardando.
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const saved = slugs.map((s) => bySlug.get(s)).filter(Boolean) as Product[];

  if (saved.length === 0) {
    return (
      <div className="wrap fav-empty">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="fav-empty-icon">
          <path d="M12 21s-7.5-4.6-10-9.2C.7 9 1.6 5.7 4.6 4.8c2-.6 3.9.3 4.9 1.9 1-1.6 2.9-2.5 4.9-1.9 3 .9 3.9 4.2 2.6 7C19.5 16.4 12 21 12 21z" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
        </svg>
        <h2>Todavía no guardaste nada</h2>
        <p>Tocá el corazón en las prendas que te gusten y las vas a encontrar acá, en este dispositivo.</p>
        <Link href="/productos" className="btn btn-ink">Ver la colección</Link>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 16 }}>
          <p style={{ fontFamily: "var(--oswald)", letterSpacing: ".14em", textTransform: "uppercase", fontSize: 13, color: "var(--gris)", margin: 0 }}>
            {saved.length} {saved.length === 1 ? "prenda guardada" : "prendas guardadas"}
          </p>
          <button className="fav-clear" onClick={clear}>Vaciar favoritos</button>
        </div>
        <div className="grid-products">
          {saved.map((p) => <ProductCard key={p.id} p={p} symbol={symbol} />)}
        </div>
      </div>
    </section>
  );
}

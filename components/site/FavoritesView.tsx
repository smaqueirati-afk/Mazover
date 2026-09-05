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
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
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

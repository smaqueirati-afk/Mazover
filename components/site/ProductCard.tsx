import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import FavButton from "./FavButton";

function isSoldOut(p: Product) {
  return p.colors.every((c) => c.variants.every((v) => v.stock <= 0));
}

export default function ProductCard({ p, symbol }: { p: Product; symbol: string }) {
  const soldOut = isSoldOut(p);
  return (
    <article className="prod" style={{ position: "relative" }}>
      <FavButton slug={p.slug} />
      <Link href={`/productos/${p.slug}`} className="prod-media" style={{ aspectRatio: "4 / 5" }}>
        {soldOut ? (
          <span className="badge sold">Agotado</span>
        ) : p.is_new ? (
          <span className="badge">Nuevo</span>
        ) : p.is_bestseller ? (
          <span className="badge">Best seller</span>
        ) : null}
        {p.cover_url && (
          <Image src={p.cover_url} alt={p.name} fill sizes="(max-width:880px) 50vw, 33vw" style={{ objectFit: "cover" }} />
        )}
      </Link>
      <div className="prod-info">
        <div>
          <Link href={`/productos/${p.slug}`}><div className="prod-name">{p.name}</div></Link>
          <div className="prod-fit">
            {p.fit?.name ? `${p.fit.name} Fit` : p.category?.name ?? ""}
          </div>
          <div className="swatches">
            {p.colors.map((c) => (
              <i key={c.id} className="sw" style={{ background: c.hex }} title={c.name} />
            ))}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="prod-price">
            {p.compare_at_price && (
              <span className="was">{formatPrice(p.compare_at_price, { currency_symbol: symbol })}</span>
            )}
            {formatPrice(p.price, { currency_symbol: symbol })}
          </div>
        </div>
      </div>
    </article>
  );
}

"use client";

/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { useMemo, useState } from "react";
import type { Product, Settings, ProductColor } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { buildProductWhatsAppLink } from "@/lib/whatsapp";
import { useCart } from "@/lib/cart";
import FavButton from "./FavButton";
import RestockButton from "./RestockButton";

type SizeGuide = { name: string; columns: string[]; rows: string[][] } | null;

export default function ProductView({
  product,
  settings,
  sizeGuide,
  shipTitle,
  shipBody,
}: {
  product: Product;
  settings: Settings;
  sizeGuide: SizeGuide;
  shipTitle: string;
  shipBody: string;
}) {
  const { add } = useCart();
  const [colorIdx, setColorIdx] = useState(0);
  const [gi, setGi] = useState(0);
  const [sizeId, setSizeId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const [guide, setGuide] = useState(false);
  const [added, setAdded] = useState(false);

  const color: ProductColor | undefined = product.colors[colorIdx];
  const images = color?.images ?? [];
  const variants = color?.variants ?? [];
  const symbol = settings.currency_symbol;

  const colorSoldOut = (c: ProductColor) => c.variants.every((v) => v.stock <= 0);
  const productSoldOut = product.colors.every(colorSoldOut);

  const selectedVariant = variants.find((v) => v.size_id === sizeId) ?? null;
  const price = selectedVariant?.price_override ?? color?.price_override ?? product.price;

  const selectColor = (i: number) => { setColorIdx(i); setGi(0); setSizeId(null); setAdded(false); };
  const mainImg = images[gi]?.url ?? product.cover_url ?? "";

  const waLink = useMemo(
    () =>
      buildProductWhatsAppLink(
        settings,
        product.name,
        color?.name ?? "",
        selectedVariant?.size_label ?? "(a confirmar)"
      ),
    [settings, product.name, color?.name, selectedVariant?.size_label]
  );

  const handleAdd = () => {
    if (!color || !selectedVariant) return;
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      colorName: color.name,
      sizeLabel: selectedVariant.size_label,
      price,
      qty: 1,
      image: images[0]?.url ?? product.cover_url,
    });
    setAdded(true);
  };

  const stock = selectedVariant?.stock ?? 0;

  return (
    <div className="wrap pdp">
      {/* GALERÍA */}
      <div className="gallery">
        <div className="gallery-main" onClick={() => mainImg && setLightbox(true)}>
          {mainImg && <Image src={mainImg} alt={`${product.name} — ${color?.name}`} fill priority sizes="(max-width:880px) 100vw, 55vw" style={{ objectFit: "cover" }} />}
          {images.length > 1 && (
            <div className="gallery-nav">
              <button aria-label="Anterior" onClick={(e) => { e.stopPropagation(); setGi((g) => (g - 1 + images.length) % images.length); }}>‹</button>
              <button aria-label="Siguiente" onClick={(e) => { e.stopPropagation(); setGi((g) => (g + 1) % images.length); }}>›</button>
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="gallery-thumbs">
            {images.map((im, i) => (
              <button key={im.id} className={i === gi ? "on" : ""} onClick={() => setGi(i)} aria-label={`Imagen ${i + 1}`}>
                <img src={im.url} alt={im.alt ?? ""} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="pdp-info">
        <div className="pdp-title-row">
          <h1>{product.name}</h1>
          <FavButton slug={product.slug} variant="inline" />
        </div>
        <div className="pdp-meta">
          {product.fit?.name ? `${product.fit.name} Fit` : product.category?.name}
          {color?.sku_base && ` · SKU ${selectedVariant?.sku ?? color.sku_base}`}
        </div>
        <div className="pdp-price">
          {product.compare_at_price && (
            <span className="was">{formatPrice(product.compare_at_price, { currency_symbol: symbol })}</span>
          )}
          {formatPrice(price, { currency_symbol: symbol })}
        </div>
        {product.short_description && <p className="pdp-desc">{product.short_description}</p>}

        {/* COLOR */}
        <div className="pdp-block">
          <div className="pdp-label">Color <span className="val">{color?.name}</span></div>
          <div className="color-row">
            {product.colors.map((c, i) => (
              <button
                key={c.id}
                className={`color-sw ${i === colorIdx ? "on" : ""} ${colorSoldOut(c) ? "soldout" : ""}`}
                style={{ background: c.hex }}
                title={c.name}
                aria-label={c.name}
                aria-pressed={i === colorIdx}
                onClick={() => selectColor(i)}
              />
            ))}
          </div>
        </div>

        {/* TALLE */}
        <div className="pdp-block">
          <div className="pdp-label">
            Talle
            {sizeGuide && <button className="size-guide-link" onClick={() => setGuide(true)}>Guía de talles</button>}
          </div>
          <div className="size-row">
            {variants.map((v) => (
              <button
                key={v.id}
                className={`size-btn ${sizeId === v.size_id ? "on" : ""} ${v.stock <= 0 ? "soldout" : ""}`}
                aria-pressed={sizeId === v.size_id}
                title={v.stock <= 0 ? "Agotado — avisame cuando vuelva" : `${v.stock} disponibles`}
                onClick={() => { setSizeId(v.size_id); setAdded(false); }}
              >
                {v.size_label}
              </button>
            ))}
          </div>
          {colorSoldOut(color!) && <p className="stock-note no">Color agotado — dejanos tu contacto y te avisamos.</p>}
          {!colorSoldOut(color!) && selectedVariant && stock <= 0 && (
            <p className="stock-note no">Talle {selectedVariant.size_label} agotado — avisame cuando vuelva.</p>
          )}
          {!colorSoldOut(color!) && selectedVariant && stock > 0 && stock <= 3 && (
            <p className="stock-note low">¡Últimas {stock} unidades!</p>
          )}
        </div>

        {/* ACCIONES */}
        {colorSoldOut(color!) || (selectedVariant && stock <= 0) ? (
          <div className="pdp-actions">
            <RestockButton
              productName={product.name}
              colorName={color?.name ?? ""}
              sizeLabel={selectedVariant && stock <= 0 ? selectedVariant.size_label : ""}
            />
          </div>
        ) : (
          <div className="pdp-actions">
            <button className="btn btn-ink" disabled={!selectedVariant} onClick={handleAdd}>
              {added ? "Agregado ✓" : "Agregar"}
            </button>
            <a
              className="btn btn-primary"
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Comprar por WhatsApp
            </a>
          </div>
        )}
        {!selectedVariant && !productSoldOut && (
          <p className="stock-note">Elegí un talle para agregar o consultar.</p>
        )}

        {/* DETALLES */}
        <div className="pdp-accordion">
          {product.description && (
            <details open>
              <summary>Descripción <span>+</span></summary>
              <p>{product.description}</p>
            </details>
          )}
          {product.composition && (
            <details>
              <summary>Composición <span>+</span></summary>
              <p>{product.composition}</p>
            </details>
          )}
          <details>
            <summary>{shipTitle} <span>+</span></summary>
            <p>{shipBody}</p>
          </details>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightbox && mainImg && (
        <div className="lightbox" onClick={() => setLightbox(false)}>
          <button className="lb-x" aria-label="Cerrar">✕</button>
          <img src={mainImg} alt={product.name} />
        </div>
      )}

      {/* GUÍA DE TALLES */}
      {guide && sizeGuide && (
        <div className="modal-backdrop" onClick={() => setGuide(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h3>Guía de talles · {sizeGuide.name}</h3>
            <table className="size-table">
              <thead>
                <tr>{sizeGuide.columns.map((c) => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {sizeGuide.rows.map((row, i) => (
                  <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
            <button className="btn btn-ink" style={{ marginTop: 20 }} onClick={() => setGuide(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

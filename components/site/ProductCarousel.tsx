"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
  </svg>
);

export default function ProductCarousel({
  products,
  eyebrow,
  title,
  linkHref = "/productos",
  linkLabel = "Ver más",
  symbol,
}: {
  products: Product[];
  eyebrow?: string;
  title?: string;
  linkHref?: string;
  linkLabel?: string;
  symbol: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= max - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, [update]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.82, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="section carousel">
      <div className="wrap">
        <div className="carousel-head">
          <div>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title && <h2>{title}</h2>}
          </div>
          <div className="carousel-tools">
            <Link className="coll-link" href={linkHref}>{linkLabel}</Link>
            <div className="carousel-arrows">
              <button aria-label="Anterior" onClick={() => scrollBy(-1)} disabled={atStart}><Chevron dir="left" /></button>
              <button aria-label="Siguiente" onClick={() => scrollBy(1)} disabled={atEnd}><Chevron dir="right" /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="carousel-track" ref={trackRef} role="list">
        {products.map((p) => (
          <div className="carousel-item" role="listitem" key={p.id}>
            <ProductCard p={p} symbol={symbol} />
          </div>
        ))}
      </div>
    </section>
  );
}

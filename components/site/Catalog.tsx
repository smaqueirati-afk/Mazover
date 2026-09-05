"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { filterProducts, type CatalogParams } from "@/lib/filter";
import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";

export type CatalogOptions = {
  categories: { slug: string; name: string }[];
  fits: { slug: string; name: string }[];
  colors: { slug: string; name: string; hex: string }[];
  sizes: string[];
};

const ORDENES = [
  { v: "destacados", l: "Destacados" },
  { v: "nuevos", l: "Más recientes" },
  { v: "precio-asc", l: "Precio: menor a mayor" },
  { v: "precio-desc", l: "Precio: mayor a menor" },
];

export default function Catalog({
  products,
  options,
  symbol,
  initial,
}: {
  products: Product[];
  options: CatalogOptions;
  symbol: string;
  initial: CatalogParams;
}) {
  const [params, setParams] = useState<CatalogParams>({ orden: "destacados", ...initial });
  const [drawer, setDrawer] = useState(false);

  const filtered = useMemo(() => filterProducts(products, params), [products, params]);
  const set = (patch: Partial<CatalogParams>) => setParams((p) => ({ ...p, ...patch }));
  const toggle = (key: keyof CatalogParams, value: string) =>
    setParams((p) => ({ ...p, [key]: p[key] === value ? undefined : value }));

  const activeCount = ["categoria", "corte", "color", "talle"].filter(
    (k) => params[k as keyof CatalogParams]
  ).length;

  const filtersEl = () => (
    <div className="filters">
      <FilterGroup title="Categoría">
        {options.categories.map((o) => (
          <FilterOpt key={o.slug} active={params.categoria === o.slug} onClick={() => toggle("categoria", o.slug)}>{o.name}</FilterOpt>
        ))}
      </FilterGroup>
      <FilterGroup title="Corte">
        {options.fits.map((o) => (
          <FilterOpt key={o.slug} active={params.corte === o.slug} onClick={() => toggle("corte", o.slug)}>{o.name}</FilterOpt>
        ))}
      </FilterGroup>
      <FilterGroup title="Color">
        <div className="filter-swatches">
          {options.colors.map((o) => (
            <button
              key={o.slug}
              className={cn("fsw", params.color === o.slug && "on")}
              style={{ background: o.hex }}
              title={o.name}
              aria-label={o.name}
              aria-pressed={params.color === o.slug}
              onClick={() => toggle("color", o.slug)}
            />
          ))}
        </div>
      </FilterGroup>
      {options.sizes.length > 0 && (
        <FilterGroup title="Talle">
          <div className="filter-sizes">
            {options.sizes.map((s) => (
              <button key={s} className={cn("fsize", params.talle === s && "on")} aria-pressed={params.talle === s} onClick={() => toggle("talle", s)}>{s}</button>
            ))}
          </div>
        </FilterGroup>
      )}
      {activeCount > 0 && (
        <button className="filter-clear" onClick={() => setParams({ orden: params.orden, q: params.q })}>
          Limpiar filtros ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="wrap catalog-wrap">
      <div className="toolbar">
        <div className="toolbar-left">
          <input
            className="search"
            type="search"
            placeholder="Buscar por nombre, corte, color…"
            defaultValue={params.q ?? ""}
            onChange={(e) => set({ q: e.target.value })}
            aria-label="Buscar productos"
          />
          <button className="filters-btn" onClick={() => setDrawer(true)}>
            Filtros{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
        </div>
        <div className="toolbar-right">
          <span className="count">{filtered.length} producto{filtered.length !== 1 ? "s" : ""}</span>
          <select className="sort" value={params.orden} onChange={(e) => set({ orden: e.target.value })} aria-label="Ordenar">
            {ORDENES.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        </div>
      </div>

      <div className="catalog-layout">
        <aside className="catalog-aside">{filtersEl()}</aside>
        <div>
          {filtered.length > 0 ? (
            <div className="grid-products">
              {filtered.map((p) => <ProductCard key={p.id} p={p} symbol={symbol} />)}
            </div>
          ) : (
            <div className="empty">
              <p className="empty-title">No encontramos productos con esos filtros.</p>
              <button className="btn btn-ink" onClick={() => setParams({ orden: "destacados" })}>Ver todo</button>
            </div>
          )}
        </div>
      </div>

      {drawer && (
        <div className="drawer-backdrop" onClick={() => setDrawer(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Filtros">
            <div className="drawer-head">
              <h3>Filtros</h3>
              <button aria-label="Cerrar" onClick={() => setDrawer(false)} className="drawer-x">✕</button>
            </div>
            {filtersEl()}
            <button className="btn btn-primary drawer-apply" onClick={() => setDrawer(false)}>
              Ver {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="filter-group">
      <h4 className="filter-title">{title}</h4>
      {children}
    </div>
  );
}
function FilterOpt({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button className={cn("filter-opt", active && "on")} aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  );
}

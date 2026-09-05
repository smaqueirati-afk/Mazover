"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MenuItem, Settings } from "@/lib/types";
import { cn, menuHref } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import SolButton from "./SolButton";

function Logo({ brand, tagline }: { brand: string; tagline: string }) {
  return (
    <Link href="/" className="logo" style={{ color: "inherit" }} aria-label={brand}>
      <span className="logo-badge">{brand}</span>
      <span className="logo-txt">
        <span className="logo-word">{brand}</span>
        <span className="logo-tag">{tagline}</span>
      </span>
    </Link>
  );
}

function IconSearch() { return (<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>); }
function IconUser() { return (<svg viewBox="0 0 24 24"><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" /></svg>); }
function IconBag() { return (<svg viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>); }
function IconMenu() { return (<svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" /></svg>); }
function IconClose() { return (<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>); }

function Mega({ item }: { item: MenuItem }) {
  const columns = new Map<string, MenuItem[]>();
  let feature: MenuItem | null = null;
  for (const child of item.children) {
    if (child.column_group === "Destacado" || child.image_url) { feature = child; continue; }
    const g = child.column_group ?? "Ver";
    if (!columns.has(g)) columns.set(g, []);
    columns.get(g)!.push(child);
  }
  return (
    <div className="mega">
      <div className="mega-inner">
        {[...columns.entries()].map(([group, items]) => (
          <div className="mega-col" key={group}>
            <h5><SolButton size={11} />{group}</h5>
            {items.map((c) => (
              <Link key={c.id} href={menuHref(c)}>{c.label}</Link>
            ))}
          </div>
        ))}
        {feature && (
          <Link className="mega-feat" href={menuHref(feature)}>
            {feature.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={feature.image_url} alt={feature.label} />
            )}
            <span className="cap">
              <span className="k">Destacado</span>
              <span className="t">{feature.label}</span>
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function SiteHeader({
  menu,
  settings,
}: {
  menu: MenuItem[];
  settings: Settings;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const { count } = useCart();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    setSearch(false);
    router.push(term ? `/productos?q=${encodeURIComponent(term)}` : "/productos");
  }

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Logo brand={settings.brand_name} tagline={settings.brand_tagline} />

        <ul className="nav-links">
          {menu.map((item) =>
            item.children.length > 0 ? (
              <li key={item.id} className="has-mega">
                <Link href={menuHref(item)} className={cn(isActive(menuHref(item)) && "on")}>
                  {item.label}
                  <svg className="chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
                </Link>
                <Mega item={item} />
              </li>
            ) : (
              <li key={item.id}><Link href={menuHref(item)} className={cn(isActive(menuHref(item)) && "on")}>{item.label}</Link></li>
            )
          )}
        </ul>

        <div className="nav-icons">
          <button aria-label="Buscar" onClick={() => setSearch((s) => !s)}><IconSearch /></button>
          <Link href="/admin" aria-label="Cuenta" className="hide-mobile"><IconUser /></Link>
          <Link href="/carrito" aria-label="Carrito" style={{ position: "relative" }}>
            <IconBag />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
          <button className="nav-burger" aria-label="Menú" onClick={() => setOpen(true)}>
            <IconMenu />
          </button>
        </div>
      </div>

      {/* Buscador */}
      {search && (
        <div className="nav-search">
          <form className="wrap" onSubmit={submitSearch} style={{ display: "flex", gap: 12, alignItems: "center", padding: "16px clamp(20px,5vw,72px)" }}>
            <IconSearch />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar jeans, cortes, colores…"
              aria-label="Buscar"
              style={{ flex: 1, background: "transparent", border: 0, outline: "none", color: "#fff", fontSize: 18, fontFamily: "var(--oswald)", letterSpacing: ".04em" }}
            />
            <button type="button" aria-label="Cerrar" onClick={() => setSearch(false)} style={{ background: "none", border: 0, color: "rgba(255,255,255,.7)", cursor: "pointer", fontSize: 18 }}>✕</button>
          </form>
        </div>
      )}

      {/* Drawer mobile a pantalla completa */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed", inset: 0, zIndex: 60, background: "var(--azul-profundo)",
            color: "#fff", padding: "28px 24px", display: "flex", flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Logo brand={settings.brand_name} tagline={settings.brand_tagline} />
            <button className="nav-burger" style={{ display: "inline-flex" }} aria-label="Cerrar" onClick={() => setOpen(false)}>
              <IconClose />
            </button>
          </div>
          <nav style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 6 }}>
            {menu.map((item) => (
              <div key={item.id}>
                <Link
                  href={menuHref(item)}
                  onClick={() => setOpen(false)}
                  style={{ fontFamily: "var(--oswald)", textTransform: "uppercase", fontSize: 26, fontWeight: 600, padding: "10px 0", display: "block", letterSpacing: ".02em" }}
                >
                  {item.label}
                </Link>
                {item.children.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px", paddingBottom: 12 }}>
                    {item.children.filter((c) => !c.image_url).map((c) => (
                      <Link key={c.id} href={menuHref(c)} onClick={() => setOpen(false)}
                        style={{ fontFamily: "var(--oswald)", textTransform: "uppercase", fontSize: 13, color: "var(--celeste)", letterSpacing: ".08em" }}>
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

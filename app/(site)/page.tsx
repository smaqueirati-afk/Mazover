/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import { getContent, getSettings, getFeaturedProducts, getReels } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import SolButton from "@/components/site/SolButton";
import NewsletterForm from "@/components/site/NewsletterForm";
import type { Product } from "@/lib/types";

const Arrow = () => (
  <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
);
const IgIcon = ({ s = 16 }: { s?: number }) => (
  <svg viewBox="0 0 24 24" style={{ width: s, height: s, stroke: "currentColor", fill: "none", strokeWidth: 1.7 }}>
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" />
  </svg>
);

// Iconos de la franja de features (stroke fino)
const featIcons = [
  <svg key="0" viewBox="0 0 24 24"><path d="M12 3c2 2 2 4 0 6-2-2-2-4 0-6zM12 9c2-2 4-2 6 0-2 2-4 2-6 0zM12 9c-2-2-4-2-6 0 2 2 4 2 6 0zM12 9v3M9 21h6l-1.5-6h-3z" /></svg>,
  <svg key="1" viewBox="0 0 24 24"><path d="M7 3h10l1 18h-6l-.5-9h-1l-.5 9H4z" /><path d="M7 3l2 5M17 3l-2 5" /></svg>,
  <svg key="2" viewBox="0 0 24 24"><path d="M3 21l9-9M14 10l4-4a3 3 0 1 0-4-4l-4 4" /><circle cx="16" cy="8" r="1" /></svg>,
  <svg key="3" viewBox="0 0 24 24"><path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z" /><circle cx="12" cy="11" r="2.2" /></svg>,
];

function ProductEditorial({ p, variant, symbol, ctaLabel, cuotasN }: { p: Product; variant: "a" | "b"; symbol: string; ctaLabel: string; cuotasN: number }) {
  const cuota = Math.round(p.price / cuotasN);
  return (
    <article className={`prod prod-${variant}`}>
      <Link href={`/productos/${p.slug}`} className="prod-media">
        {p.is_new && <span className="badge">Nuevo</span>}
        {!p.is_new && p.is_bestseller && <span className="badge">Best seller</span>}
        {p.cover_url && <Image src={p.cover_url} alt={p.name} fill sizes="(max-width:880px) 100vw, 40vw" style={{ objectFit: "cover" }} />}
      </Link>
      <div className="prod-info">
        <div>
          <div className="prod-name">{p.name}</div>
          <div className="prod-fit">
            {p.fit?.name ? `${p.fit.name} Fit` : ""}{p.colors[0] ? ` · ${p.colors[0].name}` : ""}
          </div>
          <div className="swatches">
            {p.colors.map((c) => (
              <i key={c.id} className="sw" style={{ background: c.hex }} title={c.name} />
            ))}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="prod-price">
            {p.compare_at_price && <span className="was">{formatPrice(p.compare_at_price, { currency_symbol: symbol })}</span>}
            {formatPrice(p.price, { currency_symbol: symbol })}
          </div>
          <div className="prod-cuotas">{cuotasN} cuotas de {formatPrice(cuota, { currency_symbol: symbol })}</div>
          <Link href={`/productos/${p.slug}`} className="prod-cta">{ctaLabel} <Arrow /></Link>
        </div>
      </div>
    </article>
  );
}

export default async function HomePage() {
  const [content, settings, products, reels] = await Promise.all([
    getContent(),
    getSettings(),
    getFeaturedProducts(),
    getReels(),
  ]);

  const t = (k: string) => content[k]?.value ?? "";
  const im = (k: string) => content[k]?.image_url ?? "";
  const symbol = settings.currency_symbol;
  const marquee = t("home.marquee.items").split("|").filter(Boolean);
  const philoParas = t("home.philo.body").split("\n\n");
  const waLink = buildWhatsAppLink(settings, []);
  const cuotasN = parseInt(t("home.product.cuotas"), 10) || 3;
  const prodCta = t("home.product.cta") || "Ver producto";

  return (
    <>
      {/* HERO */}
      <header className="hero">
        <div className="hero-copy">
          {t("home.hero.badge") && <span className="hero-new">{t("home.hero.badge")}</span>}
          <h1 className="hero-title">
            <span className="l1">{t("home.hero.title_1")}</span>
            <span className="l2">{t("home.hero.title_2")}</span>
          </h1>
          <div className="hero-kicker">{t("home.hero.kicker")}</div>
          <div className="hero-rule"><span className="bar" /><SolButton size={30} /><span className="bar" /></div>
          <p className="hero-sub">{t("home.hero.subtitle")}</p>
          <div className="hero-cta">
            <Link className="btn-red" href="/productos">{t("home.hero.cta1")}</Link>
            <Link className="btn btn-outline" href="/la-marca">{t("home.hero.cta2")}</Link>
          </div>
        </div>
        <div className="hero-media">
          {im("home.hero.image") && <Image src={im("home.hero.image")} alt="Campaña MAZOVER" fill priority sizes="(max-width:880px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: "center top" }} />}
        </div>
        <div className="hero-features">
          {[1, 2, 3, 4].map((n, i) => (
            <div className="hero-feature" key={n}>
              {featIcons[i]}
              <div>
                <div className="t">{t(`home.features.${n}.title`)}</div>
                <div className="b">{t(`home.features.${n}.body`)}</div>
              </div>
            </div>
          ))}
        </div>
      </header>
      <div className="hero-bar" />

      {/* MARQUEE */}
      <div className="marquee">
        <div className="wrap marquee-inner">
          {marquee.map((item, i) => (
            <span key={item} style={{ display: "contents" }}>
              <span className="txt">{item}</span>
              {i < marquee.length - 1 && <SolButton size={13} />}
            </span>
          ))}
        </div>
      </div>

      {/* FILOSOFIA */}
      <section className="section philo">
        <div className="wrap philo-grid">
          <div>
            <div className="kicker"><span className="rule" /><span className="eyebrow">{t("home.philo.eyebrow")}</span></div>
            <h2>{t("home.philo.title")}</h2>
            {philoParas.map((para, i) => <p key={i}>{para}</p>)}
          </div>
          <div className="philo-media">
            <div className="badge-sol"><SolButton size={38} /></div>
            {im("home.philo.image") && <img className="main" src={im("home.philo.image")} alt="Textura de denim" />}
            {im("home.philo.detail") && <img className="detail" src={im("home.philo.detail")} alt="Detalle de confección" style={{ objectPosition: "20% 80%" }} />}
          </div>
        </div>
      </section>

      {/* BANDA */}
      <section className="band">
        {im("home.band.image") && <Image src={im("home.band.image")} alt="Detalle de confección" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 15%" }} />}
        <div className="band-cap">
          <span className="eyebrow">{t("home.band.eyebrow")}</span>
          <h3>{t("home.band.title")}</h3>
        </div>
      </section>

      {/* SPECS */}
      <section className="specs">
        <div className="wrap specs-inner">
          {[1, 2, 3, 4].map((n) => (
            <div className="spec" key={n}>
              <div className="l">{t(`home.specs.${n}.label`)}</div>
              <div className="v">{t(`home.specs.${n}.value`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COLECCION */}
      <section className="section coll">
        <div className="wrap">
          <div className="coll-head">
            <div>
              <span className="eyebrow">{t("home.collection.eyebrow")}</span>
              <h2>{t("home.collection.title")}</h2>
            </div>
            <Link className="coll-link" href="/productos">{t("home.collection.link")}</Link>
          </div>
          {products.length > 0 ? (
            <div className="coll-editorial">
              {products[0] && <ProductEditorial p={products[0]} variant="a" symbol={symbol} ctaLabel={prodCta} cuotasN={cuotasN} />}
              {products[1] && <ProductEditorial p={products[1]} variant="b" symbol={symbol} ctaLabel={prodCta} cuotasN={cuotasN} />}
            </div>
          ) : (
            <p className="note">Todavía no hay productos destacados. Cargalos desde el panel.</p>
          )}
          <p className="note">Precios de ejemplo · editables desde el panel</p>
        </div>
      </section>

      {/* REELS */}
      <section className="section reels">
        <div className="wrap">
          <div className="reels-head">
            <div>
              <span className="eyebrow"><IgIcon />{t("home.reels.eyebrow")}</span>
              <h2>{t("home.reels.title")}</h2>
            </div>
            {settings.instagram_url && (
              <a className="ig-link" href={settings.instagram_url} target="_blank" rel="noopener noreferrer">
                {t("home.reels.link")} <Arrow />
              </a>
            )}
          </div>
          <div className="reels-grid">
            {reels.map((r) => {
              const href = r.product_slug ? `/productos/${r.product_slug}` : r.instagram_url;
              return (
                <a key={r.id} className="reel" href={href} target={r.product_slug ? undefined : "_blank"} rel="noopener noreferrer">
                  <span className="ig"><IgIcon s={19} /></span>
                  <span className="play"><svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "#fff" }}><path d="M8 5v14l11-7z" /></svg></span>
                  {r.poster_url && <Image src={r.poster_url} alt={r.caption ?? "Reel MAZOVER"} fill sizes="(max-width:880px) 50vw, 25vw" style={{ objectFit: "cover" }} />}
                  {r.product_slug && <span className="tag">{prodCta}</span>}
                  <span className="meta">
                    <span className="handle">{settings.instagram_handle}</span>
                    {r.caption && <span className="cap">{r.caption}</span>}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* HECHO EN ARGENTINA */}
      <section className="section made">
        <div className="wrap">
          <span className="eyebrow">{t("home.made.eyebrow")}</span>
          <h2>{t("home.made.title")}</h2>
          <div className="made-grid">
            {[1, 2, 3].map((n) => (
              <div className="made-col" key={n}>
                <span className="num">{String(n).padStart(2, "0")}</span>
                <h3>{t(`home.made.col${n}.title`)}</h3>
                <p>{t(`home.made.col${n}.body`)}</p>
              </div>
            ))}
          </div>
          <div className="made-photos">
            {im("home.made.image_a") && <img className="a" src={im("home.made.image_a")} alt="Taller de confección" />}
            <div className="stack">
              {im("home.made.image_b1") && <img src={im("home.made.image_b1")} alt="Textura denim" />}
              {im("home.made.image_b2") && <img src={im("home.made.image_b2")} alt="Detalle" style={{ objectPosition: "20% 80%" }} />}
            </div>
          </div>
        </div>
      </section>

      {/* FRASES */}
      <section className="frases">
        <div className="wrap">
          <div className="line"><SolButton size={20} /><h3>{t("home.frases.1")}</h3><SolButton size={20} /></div>
          <div className="hr" />
          <div className="line"><h3>{t("home.frases.2")}</h3></div>
          <div className="hr" />
          <div className="line"><SolButton size={20} /><h3>{t("home.frases.3")}</h3><SolButton size={20} /></div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter">
        {im("home.newsletter.image") && (
          <Image src={im("home.newsletter.image")} alt="" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 30%" }} />
        )}
        <div className="wrap newsletter-inner">
          <span className="eyebrow">{t("home.newsletter.eyebrow")}</span>
          <h2>{t("home.newsletter.title")}</h2>
          {t("home.newsletter.subtitle") && <p>{t("home.newsletter.subtitle")}</p>}
          <NewsletterForm
            placeholder={t("home.newsletter.placeholder") || "Ingresá tu email"}
            button={t("home.newsletter.button") || "Suscribirse"}
            source="newsletter"
            variant="band"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="foot-cta">
        <div className="wrap cta-grid">
          <div>
            <span className="eyebrow">{t("home.cta.eyebrow")}</span>
            <h2>{t("home.cta.title")}</h2>
          </div>
          <div className="cta-actions">
            <a className="btn wa-btn" href={waLink} target="_blank" rel="noopener noreferrer">{t("home.cta.whatsapp")}</a>
            <Link className="btn btn-outline-ink" href="/productos">{t("home.cta.button")}</Link>
            <p className="cta-hours">{t("home.cta.hours")}</p>
          </div>
        </div>
      </section>
    </>
  );
}

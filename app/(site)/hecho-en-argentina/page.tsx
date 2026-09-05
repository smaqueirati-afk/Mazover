/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/data";
import SolButton from "@/components/site/SolButton";

export const metadata: Metadata = {
  title: "Hecho en Argentina",
  description: "Diseñado, fabricado y pensado para durar. El denim argentino de MAZOVER.",
};

export default async function HechoPage() {
  const content = await getContent();
  const t = (k: string) => content[k]?.value ?? "";
  const im = (k: string) => content[k]?.image_url ?? "";
  const blocks = [1, 2, 3].map((n) => ({
    title: t(`hecho.b${n}.title`),
    body: t(`hecho.b${n}.body`),
    image: im(`hecho.b${n}.image`),
    n,
  }));

  return (
    <>
      {/* HERO con foto */}
      <section className="page-hero">
        {im("hecho.hero.image") && <img src={im("hecho.hero.image")} alt="Hecho en Argentina" />}
        <div className="wrap inner">
          <span className="eyebrow"><SolButton size={16} />{t("hecho.hero.eyebrow")}</span>
          <h1>{t("hecho.hero.title")}</h1>
        </div>
      </section>

      {/* INTRO */}
      <section className="section">
        <div className="wrap page-intro">
          <p style={{ fontFamily: "var(--oswald)", textTransform: "uppercase", fontSize: "clamp(22px,3vw,34px)", lineHeight: 1.2, color: "var(--tinta)", fontWeight: 600 }}>
            {t("hecho.intro")}
          </p>
        </div>
      </section>

      {blocks.map((b) => (
        <section className="section" key={b.n} style={{ paddingTop: 0 }}>
          <div className="wrap philo-grid">
            {b.n % 2 === 1 ? (
              <>
                {b.image && <img src={b.image} alt={b.title} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} />}
                <div>
                  <span className="num" style={{ fontFamily: "var(--oswald)", color: "var(--rojo)", letterSpacing: ".2em" }}>{String(b.n).padStart(2, "0")}</span>
                  <h2 style={{ fontSize: "clamp(28px,3.2vw,44px)", margin: "10px 0 16px" }}>{b.title}</h2>
                  <p className="pdp-desc">{b.body}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="num" style={{ fontFamily: "var(--oswald)", color: "var(--rojo)", letterSpacing: ".2em" }}>{String(b.n).padStart(2, "0")}</span>
                  <h2 style={{ fontSize: "clamp(28px,3.2vw,44px)", margin: "10px 0 16px" }}>{b.title}</h2>
                  <p className="pdp-desc">{b.body}</p>
                </div>
                {b.image && <img src={b.image} alt={b.title} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} />}
              </>
            )}
          </div>
        </section>
      ))}

      <section className="foot-cta">
        <div className="wrap" style={{ textAlign: "center" }}>
          <span className="eyebrow" style={{ display: "block", marginBottom: 16 }}>Orgullo que se viste</span>
          <h2 style={{ margin: "0 auto 26px" }}>Un jean para años, no para una temporada.</h2>
          <Link className="btn btn-primary" href="/productos">Ver la colección</Link>
        </div>
      </section>
    </>
  );
}

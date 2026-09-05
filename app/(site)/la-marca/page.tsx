/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { getContent } from "@/lib/data";
import SolButton from "@/components/site/SolButton";

export const metadata: Metadata = {
  title: "La Marca",
  description: "MAZOVER: denim diseñado y fabricado en Argentina, con oficio y materiales seleccionados.",
};

export default async function LaMarcaPage() {
  const content = await getContent();
  const t = (k: string) => content[k]?.value ?? "";
  const im = (k: string) => content[k]?.image_url ?? "";
  const intro = t("lamarca.intro").split("\n\n");

  return (
    <>
      {/* HERO con foto */}
      <section className="page-hero">
        {im("lamarca.hero.image") && <img src={im("lamarca.hero.image")} alt="MAZOVER" />}
        <div className="wrap inner">
          <span className="eyebrow"><SolButton size={16} />{t("lamarca.hero.eyebrow")}</span>
          <h1>{t("lamarca.hero.title")}</h1>
        </div>
      </section>

      {/* INTRO */}
      <section className="section">
        <div className="wrap page-intro">
          <div className="kicker"><span className="rule" /><span className="eyebrow">Nuestra historia</span></div>
          {intro.map((p, i) => <p key={i} style={{ marginBottom: 16 }}>{p}</p>)}
        </div>
      </section>

      {/* SECCIÓN 1 — imagen izquierda */}
      <section className="section coll">
        <div className="wrap philo-grid">
          {im("lamarca.s1.image") && <img src={im("lamarca.s1.image")} alt={t("lamarca.s1.title")} style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover" }} />}
          <div>
            <h2 style={{ fontSize: "clamp(30px,3.5vw,48px)", marginBottom: 18 }}>{t("lamarca.s1.title")}</h2>
            <p className="pdp-desc">{t("lamarca.s1.body")}</p>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2 — imagen derecha */}
      <section className="section">
        <div className="wrap philo-grid">
          <div>
            <h2 style={{ fontSize: "clamp(30px,3.5vw,48px)", marginBottom: 18 }}>{t("lamarca.s2.title")}</h2>
            <p className="pdp-desc">{t("lamarca.s2.body")}</p>
          </div>
          {im("lamarca.s2.image") && <img src={im("lamarca.s2.image")} alt={t("lamarca.s2.title")} style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover" }} />}
        </div>
      </section>

      {/* FRASE */}
      <section className="frases">
        <div className="wrap">
          <div className="line"><SolButton size={20} /><h3>{t("lamarca.quote")}</h3><SolButton size={20} /></div>
        </div>
      </section>
    </>
  );
}

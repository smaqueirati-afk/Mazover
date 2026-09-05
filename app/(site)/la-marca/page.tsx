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
      <section className="page-head">
        <div className="wrap">
          <span className="eyebrow">{t("lamarca.hero.eyebrow")}</span>
          <h1>{t("lamarca.hero.title")}</h1>
        </div>
      </section>

      <section className="section">
        <div className="wrap philo-grid">
          <div>
            <div className="kicker"><span className="rule" /><span className="eyebrow">Nuestra historia</span></div>
            {intro.map((p, i) => <p className="pdp-desc" key={i} style={{ marginBottom: 16 }}>{p}</p>)}
          </div>
          <div className="philo-media">
            <div className="badge-sol"><SolButton size={38} /></div>
            {im("lamarca.hero.image") && <img className="main" src={im("lamarca.hero.image")} alt="MAZOVER" />}
          </div>
        </div>
      </section>

      <section className="section coll">
        <div className="wrap philo-grid">
          {im("lamarca.s1.image") && <img src={im("lamarca.s1.image")} alt={t("lamarca.s1.title")} style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover" }} />}
          <div>
            <h2 style={{ fontSize: "clamp(30px,3.5vw,48px)", marginBottom: 18 }}>{t("lamarca.s1.title")}</h2>
            <p className="pdp-desc">{t("lamarca.s1.body")}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap philo-grid">
          <div>
            <h2 style={{ fontSize: "clamp(30px,3.5vw,48px)", marginBottom: 18 }}>{t("lamarca.s2.title")}</h2>
            <p className="pdp-desc">{t("lamarca.s2.body")}</p>
          </div>
          {im("lamarca.s2.image") && <img src={im("lamarca.s2.image")} alt={t("lamarca.s2.title")} style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover" }} />}
        </div>
      </section>

      <section className="frases">
        <div className="wrap">
          <div className="line"><SolButton size={20} /><h3>{t("lamarca.quote")}</h3><SolButton size={20} /></div>
        </div>
      </section>
    </>
  );
}

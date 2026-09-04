import Link from "next/link";

export default function SiteNotFound() {
  return (
    <section className="page-head" style={{ minHeight: "70vh", display: "grid", alignContent: "center" }}>
      <div className="wrap">
        <span className="eyebrow">Error 404</span>
        <h1 style={{ marginBottom: 20 }}>No encontramos esto</h1>
        <p style={{ color: "rgba(245,244,241,.7)", marginBottom: 28, maxWidth: "46ch" }}>
          El producto o la página que buscás no está disponible. Puede que se haya agotado o cambiado de lugar.
        </p>
        <Link className="btn btn-primary" href="/productos">Ver la colección</Link>
      </div>
    </section>
  );
}

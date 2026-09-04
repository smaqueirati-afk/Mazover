import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--azul-profundo)", color: "#fff", textAlign: "center", padding: 24 }}>
      <div>
        <div style={{ fontFamily: "var(--oswald)", fontSize: 12, letterSpacing: ".3em", textTransform: "uppercase", color: "var(--celeste)", marginBottom: 16 }}>Error 404</div>
        <h1 style={{ fontFamily: "var(--oswald)", textTransform: "uppercase", fontSize: "clamp(40px,8vw,90px)", color: "#fff", lineHeight: 1 }}>Página no encontrada</h1>
        <p style={{ color: "rgba(245,244,241,.7)", margin: "18px 0 30px" }}>La página que buscás no existe o cambió de lugar.</p>
        <Link className="btn btn-primary" href="/">Volver al inicio</Link>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="page-head" style={{ minHeight: "70vh", display: "grid", alignContent: "center" }}>
      <div className="wrap">
        <span className="eyebrow">Ups</span>
        <h1 style={{ marginBottom: 20 }}>Algo salió mal</h1>
        <p style={{ color: "rgba(245,244,241,.7)", marginBottom: 28, maxWidth: "46ch" }}>
          Tuvimos un problema al cargar esta sección. Probá de nuevo en un momento.
        </p>
        <button className="btn btn-primary" onClick={reset}>Reintentar</button>
      </div>
    </section>
  );
}

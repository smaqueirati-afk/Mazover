export default function Loading() {
  return (
    <div style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <span className="sol" style={{ width: 34, height: 34, animation: "spin 3s linear infinite" }} />
        <span style={{ fontFamily: "var(--oswald)", textTransform: "uppercase", fontSize: 12, letterSpacing: ".2em", color: "var(--gris)" }}>Cargando…</span>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

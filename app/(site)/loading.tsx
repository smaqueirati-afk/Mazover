import SolButton from "@/components/site/SolButton";

export default function Loading() {
  return (
    <div style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <span style={{ display: "inline-flex", animation: "spin 3s linear infinite" }}><SolButton size={38} /></span>
        <span style={{ fontFamily: "var(--oswald)", textTransform: "uppercase", fontSize: 12, letterSpacing: ".2em", color: "var(--gris)" }}>Cargando…</span>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

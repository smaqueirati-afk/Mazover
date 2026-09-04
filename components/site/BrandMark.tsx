// Emblema MAZOVER: sol de rayos finos (color arena) con centro arena.
// `disc` agrega el círculo azul profundo detrás (para fondos claros / favicon).
export default function BrandMark({
  size = 30,
  sand = "#D8C3A6",
  ink = "#0D1326",
  disc = false,
  rays = 16,
}: {
  size?: number;
  sand?: string;
  ink?: string;
  disc?: boolean;
  rays?: number;
}) {
  const cx = 50, cy = 50;
  const rInner = 15, rOuter = 40, dot = 8;
  const lines = Array.from({ length: rays }, (_, i) => {
    const a = (i * 2 * Math.PI) / rays - Math.PI / 2;
    return {
      x1: cx + rInner * Math.cos(a), y1: cy + rInner * Math.sin(a),
      x2: cx + rOuter * Math.cos(a), y2: cy + rOuter * Math.sin(a),
    };
  });
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true" style={{ flex: "none" }}>
      {disc && <circle cx={cx} cy={cy} r={49} fill={ink} />}
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={sand} strokeWidth={1.6} strokeLinecap="round" />
      ))}
      <circle cx={cx} cy={cy} r={dot} fill={sand} />
    </svg>
  );
}

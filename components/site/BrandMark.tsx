// Emblema MAZOVER: Sol de Mayo (símbolo argentino) en color arena, con rostro
// sutil — lindo y pintoresco. Rayos rectos + flamígeros alternados.
// `disc` agrega el círculo azul profundo detrás (para fondos claros / favicon).
export default function BrandMark({
  size = 42,
  sand = "#D8C3A6",
  ink = "#0D1326",
  disc = false,
}: {
  size?: number;
  sand?: string;
  ink?: string;
  disc?: boolean;
}) {
  const straight = Array.from({ length: 16 }, (_, i) => i * 22.5);
  const wavy = Array.from({ length: 16 }, (_, i) => i * 22.5 + 11.25);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true" style={{ flex: "none" }}>
      {disc && <circle cx="50" cy="50" r="50" fill={ink} />}
      {/* rayos */}
      <g fill={sand}>
        {straight.map((deg) => (
          <path key={`s${deg}`} d="M47.8 33 L50 6 L52.2 33 Z" transform={`rotate(${deg} 50 50)`} />
        ))}
        {wavy.map((deg) => (
          <path key={`w${deg}`} d="M49 33 Q46 20 50 8 Q54 20 51 33 Z" transform={`rotate(${deg} 50 50)`} />
        ))}
      </g>
      {/* disco central */}
      <circle cx="50" cy="50" r="13" fill={sand} />
      <circle cx="50" cy="50" r="13" fill="none" stroke={ink} strokeWidth="1.1" opacity="0.5" />
      {/* rostro sutil */}
      <g fill="none" stroke={ink} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.82">
        {/* cejas */}
        <path d="M44.4 46.2 Q46.6 44.9 48.4 46.4" />
        <path d="M51.6 46.4 Q53.4 44.9 55.6 46.2" />
        {/* ojos */}
        <path d="M45.4 49 Q46.6 50.4 47.9 49.1" />
        <path d="M52.1 49.1 Q53.4 50.4 54.6 49" />
        {/* nariz */}
        <path d="M50 49.6 L50 52.4" />
        {/* sonrisa */}
        <path d="M46 54.2 Q50 57.4 54 54.2" />
      </g>
    </svg>
  );
}

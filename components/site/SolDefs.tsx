// Definición única del emblema "botón de metal" (tack de jean en cobre).
// Se renderiza UNA sola vez en el layout; cada uso lo instancia con <use href="#mz-sol"/>
// (ver SolButton). Así no se duplican IDs de gradientes.
const RAYS = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5];
const RAY = "M50 7 L53.6 25 L46.4 25 Z";

export default function SolDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        <radialGradient id="mzDisc" cx="34%" cy="28%" r="78%">
          <stop offset="0" stopColor="#F6DCC2" /><stop offset=".38" stopColor="#D79A6B" />
          <stop offset=".76" stopColor="#A85C33" /><stop offset="1" stopColor="#6E3418" />
        </radialGradient>
        <linearGradient id="mzRim" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0" stopColor="#FBEAD6" /><stop offset=".45" stopColor="#9E5227" /><stop offset="1" stopColor="#4A2210" />
        </linearGradient>
        <radialGradient id="mzCore" cx="36%" cy="30%" r="72%">
          <stop offset="0" stopColor="#8E4423" /><stop offset="1" stopColor="#4E2210" />
        </radialGradient>
        <symbol id="mz-sol" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="49" fill="url(#mzRim)" />
          <circle cx="50" cy="50" r="44" fill="url(#mzDisc)" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,241,225,.45)" strokeWidth="1" />
          <g fill="#FCEBD9" opacity=".5" transform="translate(-.9 -1.1)">
            <circle cx="50" cy="50" r="15" />
            {RAYS.map((a) => <path key={a} d={RAY} transform={`rotate(${a} 50 50)`} />)}
          </g>
          <g fill="url(#mzCore)">
            <circle cx="50" cy="50" r="15" />
            {RAYS.map((a) => <path key={a} d={RAY} transform={`rotate(${a} 50 50)`} />)}
          </g>
          <path d="M50 8 A42 42 0 0 0 12 44" fill="none" stroke="rgba(255,247,236,.55)" strokeWidth="3" strokeLinecap="round" />
        </symbol>
      </defs>
    </svg>
  );
}

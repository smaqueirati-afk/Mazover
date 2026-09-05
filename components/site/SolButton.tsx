// Emblema MAZOVER: botón de metal (tack de jean) en cobre, con bisel y relieve.
// Instancia el símbolo definido una sola vez por <SolDefs /> en el layout.
export default function SolButton({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" style={{ flex: "none" }}>
      <use href="#mz-sol" />
    </svg>
  );
}

"use client";

import { useState } from "react";
import { useFavorites } from "@/lib/favorites";

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FavButton({
  slug,
  variant = "card",
  className = "",
}: {
  slug: string;
  variant?: "card" | "inline";
  className?: string;
}) {
  const { has, toggle } = useFavorites();
  const active = has(slug);
  const [pop, setPop] = useState(false);
  const label = active ? "Quitar de favoritos" : "Guardar en favoritos";

  const handleToggle = () => {
    // Sólo animamos el "pop" al pasar de apagado a encendido.
    if (!active) { setPop(true); window.setTimeout(() => setPop(false), 520); }
    toggle(slug);
  };

  if (variant === "inline") {
    return (
      <button
        type="button"
        className={`fav-inline ${active ? "on" : ""} ${pop ? "pop" : ""} ${className}`}
        aria-pressed={active}
        aria-label={label}
        title={label}
        onClick={handleToggle}
      >
        <Heart filled={active} />
        <span>{active ? "Guardado" : "Guardar"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`fav-btn ${active ? "on" : ""} ${pop ? "pop" : ""} ${className}`}
      aria-pressed={active}
      aria-label={label}
      title={label}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggle(); }}
    >
      <Heart filled={active} />
    </button>
  );
}

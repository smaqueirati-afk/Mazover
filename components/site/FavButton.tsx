"use client";

import { useFavorites } from "@/lib/favorites";

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21s-7.5-4.6-10-9.2C.7 9 1.6 5.7 4.6 4.8c2-.6 3.9.3 4.9 1.9 1-1.6 2.9-2.5 4.9-1.9 3 .9 3.9 4.2 2.6 7C19.5 16.4 12 21 12 21z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.7}
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
  const label = active ? "Quitar de favoritos" : "Guardar en favoritos";

  if (variant === "inline") {
    return (
      <button
        type="button"
        className={`fav-inline ${active ? "on" : ""} ${className}`}
        aria-pressed={active}
        aria-label={label}
        title={label}
        onClick={() => toggle(slug)}
      >
        <Heart filled={active} />
        <span>{active ? "Guardado" : "Guardar"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`fav-btn ${active ? "on" : ""} ${className}`}
      aria-pressed={active}
      aria-label={label}
      title={label}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(slug); }}
    >
      <Heart filled={active} />
    </button>
  );
}

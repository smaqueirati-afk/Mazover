"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Reel } from "@/lib/types";

function IgIcon({ s = 19 }: { s?: number }) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: s, height: s, stroke: "currentColor", fill: "none", strokeWidth: 1.7 }}>
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" />
    </svg>
  );
}

export default function ReelsMarquee({
  reels,
  handle,
  ctaLabel,
}: {
  reels: Reel[];
  handle: string | null;
  ctaLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const drag = useRef<{ x: number; left: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // solo scroll manual

    let raf = 0;
    let last = performance.now();
    const speed = 95; // px por segundo (rápido)
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const half = el.scrollWidth / 2;
      if (!paused.current && half > 0) {
        let x = el.scrollLeft + speed * dt;
        if (x >= half) x -= half;      // loop hacia adelante
        else if (x < 0) x += half;     // loop hacia atrás (tras empujar)
        el.scrollLeft = x;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pause = () => { paused.current = true; };
  const resume = () => { paused.current = false; drag.current = null; };

  // Arrastre con mouse en escritorio (en celular el swipe táctil ya es nativo).
  const onDown = (e: React.PointerEvent) => {
    paused.current = true;
    if (e.pointerType === "mouse" && ref.current) {
      drag.current = { x: e.clientX, left: ref.current.scrollLeft };
    }
  };
  const onMove = (e: React.PointerEvent) => {
    if (drag.current && ref.current) {
      ref.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
    }
  };

  // Duplicamos para loop sin cortes; la copia va oculta a lectores de pantalla.
  const items = [...reels, ...reels];

  return (
    <div
      className="reels-strip"
      ref={ref}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={resume}
      onPointerCancel={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      {items.map((r, i) => {
        const dup = i >= reels.length;
        const href = r.product_slug ? `/productos/${r.product_slug}` : r.instagram_url;
        return (
          <a
            key={`${r.id}-${i}`}
            className="reel"
            href={href}
            target={r.product_slug ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-hidden={dup || undefined}
            tabIndex={dup ? -1 : undefined}
            draggable={false}
          >
            <span className="ig"><IgIcon s={19} /></span>
            <span className="play"><svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "#fff" }}><path d="M8 5v14l11-7z" /></svg></span>
            {r.poster_url && <Image src={r.poster_url} alt={r.caption ?? "Reel MAZOVER"} fill sizes="(max-width:880px) 60vw, 255px" style={{ objectFit: "cover" }} draggable={false} />}
            {r.product_slug && <span className="tag">{ctaLabel}</span>}
            <span className="meta">
              <span className="handle">{handle}</span>
              {r.caption && <span className="cap">{r.caption}</span>}
            </span>
          </a>
        );
      })}
    </div>
  );
}

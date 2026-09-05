"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type FavCtx = {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  count: number;
  ready: boolean;
};

const Ctx = createContext<FavCtx | null>(null);
const KEY = "mazover_fav_v1";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Sincroniza favoritos con localStorage al montar (store externo por dispositivo).
    let loaded: string[] = [];
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) loaded = JSON.parse(raw);
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlugs(Array.isArray(loaded) ? loaded : []);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(slugs)); } catch {}
  }, [slugs, ready]);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const toggle = useCallback((slug: string) => {
    setSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev]));
  }, []);

  const remove = useCallback((slug: string) => {
    setSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  const clear = useCallback(() => setSlugs([]), []);

  return (
    <Ctx.Provider value={{ slugs, has, toggle, remove, clear, count: slugs.length, ready }}>
      {children}
    </Ctx.Provider>
  );
}

export function useFavorites() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useFavorites debe usarse dentro de <FavoritesProvider>");
  return c;
}

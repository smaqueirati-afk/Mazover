// Paletas coherentes seleccionables desde el panel (Configuración).
// Cada una define el set completo de tokens; el layout las inyecta como CSS vars.

export type PaletteTokens = {
  noche: string; tinta: string; papel: string; papel2: string;
  azul: string; azul2: string; celeste: string; celesteHi: string; celesteLo: string;
  rojo: string; arena: string; arenaDeep: string; gris: string; grisSoft: string;
};

export type Palette = { key: string; name: string; desc: string; tokens: PaletteTokens };

export const PALETTES: Palette[] = [
  {
    key: "heritage",
    name: "Heritage · Denim & Rojo",
    desc: "Azul noche, papel cálido y rojo de acción. Clásico, confiable, argentino.",
    tokens: {
      noche: "#0A1626", tinta: "#0B1220", papel: "#F1EEE8", papel2: "#E4DBCB",
      azul: "#1E3B63", azul2: "#2A4E7E", celeste: "#A7C7E7", celesteHi: "#C3DCF2", celesteLo: "#5D93C8",
      rojo: "#C8281E", arena: "#C9A36A", arenaDeep: "#8A6B41", gris: "#6B6F74", grisSoft: "#9BA0A6",
    },
  },
  {
    key: "indigo-cobre",
    name: "Índigo & Cobre",
    desc: "Índigo profundo, off-white y cobre. Más cálido y sofisticado; menos rojo.",
    tokens: {
      noche: "#14233B", tinta: "#101C30", papel: "#F3F1EC", papel2: "#E7E1D5",
      azul: "#2A4A78", azul2: "#3A5C8E", celeste: "#B9D2EA", celesteHi: "#D3E2F1", celesteLo: "#6E96C2",
      rojo: "#BE5A2B", arena: "#C79A5E", arenaDeep: "#8A6234", gris: "#6E7176", grisSoft: "#9DA2A8",
    },
  },
  {
    key: "noche-acero",
    name: "Noche & Acero",
    desc: "Casi negro, blanco limpio y azul acero con rojo vivo. Moderno y minimalista.",
    tokens: {
      noche: "#0E1116", tinta: "#0E1116", papel: "#F6F5F3", papel2: "#ECEAE6",
      azul: "#24467A", azul2: "#33578E", celeste: "#BFD6EE", celesteHi: "#CBDDF2", celesteLo: "#5E8FCB",
      rojo: "#DB3B2E", arena: "#C2A06B", arenaDeep: "#877046", gris: "#6A6E74", grisSoft: "#9A9EA4",
    },
  },
  {
    key: "campo",
    name: "Campo · Verde & Óxido",
    desc: "Verde loden, crema y óxido. Terroso y artesanal, con raíz de campo argentino.",
    tokens: {
      noche: "#1C2A22", tinta: "#16211B", papel: "#F1EDE3", papel2: "#E3DCCB",
      azul: "#2E4A3A", azul2: "#3C5C49", celeste: "#CBB98F", celesteHi: "#EAD9B8", celesteLo: "#B98A4E",
      rojo: "#B4472A", arena: "#C9A36A", arenaDeep: "#8A6B41", gris: "#6C6E68", grisSoft: "#9CA096",
    },
  },
];

export function getPalette(key: string | null | undefined): Palette {
  return PALETTES.find((p) => p.key === key) ?? PALETTES[0];
}

/** Devuelve el bloque `:root{…}` con todos los CSS vars para la paleta dada. */
export function getPaletteVars(key: string | null | undefined): string {
  const t = getPalette(key).tokens;
  return `:root{` +
    `--azul-noche:${t.noche};--azul-profundo:${t.noche};--tinta:${t.tinta};` +
    `--papel:${t.papel};--blanco:${t.papel};--papel-2:${t.papel2};--blanco-2:${t.papel2};` +
    `--azul:${t.azul};--azul-2:${t.azul2};` +
    `--celeste:${t.celeste};--celeste-hi:${t.celesteHi};--celeste-lo:${t.celesteLo};` +
    `--rojo:${t.rojo};--rojo-vivo:${t.rojo};` +
    `--arena:${t.arena};--arena-deep:${t.arenaDeep};` +
    `--gris:${t.gris};--gris-soft:${t.grisSoft};` +
    `}`;
}

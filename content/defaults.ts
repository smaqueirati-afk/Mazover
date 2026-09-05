import type {
  Settings,
  ContentMap,
  Product,
  Reel,
  MenuItem,
  Size,
} from "@/lib/types";

// Estos defaults reflejan el seed de Supabase. Se usan como fallback cuando
// Supabase todavía no está configurado, y para completar claves faltantes.

export const defaultSettings: Settings = {
  brand_name: "MAZOVER",
  brand_tagline: "Hecho y para argentinos",
  logo_url: null,
  whatsapp_number: "5491100000000",
  whatsapp_message: "Hola, quiero consultar por:",
  instagram_url: "https://instagram.com/mazover",
  instagram_handle: "@mazover",
  email: "hola@mazover.com",
  address: null,
  color_ink: "#0D1326",
  color_surface: "#F5F4F1",
  color_blue: "#1E3B63",
  color_celeste: "#A7C7E7",
  color_sand: "#D8C3A6",
  color_red: "#B0362B",
  seo_title: "MAZOVER — Hecho y para argentinos",
  seo_description:
    "Jeans diseñados y fabricados en Argentina, con materiales seleccionados y una obsesión por cada detalle.",
  seo_og_image: "/demo/hero.jpg",
  currency: "ARS",
  currency_symbol: "$",
};

const c = (value: string | null, image_url: string | null = null) => ({ value, image_url });

export const defaultContent: ContentMap = {
  "home.hero.eyebrow": c("Hecho y para argentinos"),
  "home.hero.title": c("Calidad que se siente."),
  "home.hero.title_1": c("Por siempre"),
  "home.hero.title_2": c("Argentinas"),
  "home.hero.kicker": c("Orgullo que se viste"),
  "home.hero.subtitle": c(
    "Jeans diseñados y fabricados en Argentina, con materiales seleccionados y una obsesión por cada detalle. Para tu día a día."
  ),
  "home.hero.cta1": c("Ver colección"),
  "home.hero.cta2": c("Conocer la marca"),
  "home.hero.badge": c("Nuevo"),
  "home.hero.image": c(null, "/demo/hero.jpg"),
  "home.features.1.title": c("Algodón premium"),
  "home.features.1.body": c("Suave y resistente"),
  "home.features.2.title": c("Corte clásico y cómodo"),
  "home.features.2.body": c("Para todos los días"),
  "home.features.3.title": c("Bordado de calidad"),
  "home.features.3.body": c("Detalles que duran"),
  "home.features.4.title": c("Hecho en Argentina"),
  "home.features.4.body": c("Diseñado y producido con orgullo"),
  "home.specs.1.label": c("Denim"),
  "home.specs.1.value": c("14.5 oz rígido"),
  "home.specs.2.label": c("Composición"),
  "home.specs.2.value": c("100% algodón"),
  "home.specs.3.label": c("Confección"),
  "home.specs.3.value": c("Taller propio"),
  "home.specs.4.label": c("Origen"),
  "home.specs.4.value": c("Argentina"),
  "home.marquee.items": c(
    "Algodón premium|Confort|Durabilidad|Diseño atemporal|Orgullo argentino"
  ),
  "home.philo.eyebrow": c("Nuestra esencia"),
  "home.philo.title": c("Hecho acá. Pensado para durar."),
  "home.philo.body": c(
    "Creemos que un buen jean no debería depender de una tendencia. Debería acompañarte durante años, adaptarse a tu forma de vivir y mejorar con el tiempo.\n\nTrabajamos con talleres argentinos, algodón seleccionado y una confección obsesiva: cada costura, cada remache y cada botón están pensados para resistir el uso real."
  ),
  "home.philo.image": c(null, "/demo/texture.jpg"),
  "home.philo.detail": c(null, "/demo/button.jpg"),
  "home.band.eyebrow": c("Los códigos del jean"),
  "home.band.title": c("Corte cómodo. Costuras reforzadas. Detalles que duran."),
  "home.band.image": c(null, "/demo/detail.jpg"),
  "home.collection.eyebrow": c("Colección destacada"),
  "home.collection.title": c("Cortes que se quedan"),
  "home.collection.link": c("Ver toda la colección"),
  "home.product.cta": c("Ver producto"),
  "home.product.cuotas": c("3"),
  "home.reels.eyebrow": c("@mazover"),
  "home.reels.title": c("Mirá cómo se usan"),
  "home.reels.link": c("Seguinos en Instagram"),
  "home.made.eyebrow": c("Hecho en Argentina"),
  "home.made.title": c("Diseñado acá. Fabricado acá. Seleccionado para durar."),
  "home.made.col1.title": c("Diseñado acá"),
  "home.made.col1.body": c(
    "Cada corte nace en nuestro taller: probamos, ajustamos y repetimos hasta que el jean cae como tiene que caer."
  ),
  "home.made.col2.title": c("Fabricado acá"),
  "home.made.col2.body": c(
    "Trabajamos con confeccionistas argentinos. El trabajo bien hecho sostiene a personas reales, no solo a una etiqueta."
  ),
  "home.made.col3.title": c("Para durar"),
  "home.made.col3.body": c(
    "Denim de gramaje alto, costuras reforzadas y avíos que resisten. Un jean para años, no para una temporada."
  ),
  "home.made.image_a": c(null, "/demo/atelier.jpg"),
  "home.made.image_b1": c(null, "/demo/texture.jpg"),
  "home.made.image_b2": c(null, "/demo/button.jpg"),
  "home.frases.1": c("Hecho y para argentinos"),
  "home.frases.2": c("Orgullo que se viste"),
  "home.frases.3": c("Para tu día a día"),
  "home.cta.eyebrow": c("Comprá por WhatsApp"),
  "home.cta.title": c("Elegí tu corte. Nosotros hacemos el resto."),
  "home.cta.button": c("Ver la colección"),
  "home.cta.whatsapp": c("Comprar por WhatsApp"),
  "home.cta.hours": c("Respondemos de 9 a 19 h · Lun a sáb"),
  "footer.about": c(
    "Denim diseñado y fabricado en Argentina. Calidad que se siente, orgullo que se viste."
  ),
  "product.ship.title": c("Envíos y cambios"),
  "product.ship.body": c(
    "Coordinamos envíos a todo el país. Cambios dentro de los 30 días con la prenda sin uso. Consultanos por WhatsApp."
  ),

  // --- Página LA MARCA ---
  "lamarca.hero.eyebrow": c("La marca"),
  "lamarca.hero.title": c("Denim con oficio, hecho acá."),
  "lamarca.hero.image": c(null, "/demo/detail.jpg"),
  "lamarca.intro": c(
    "MAZOVER nació de una idea simple y terca: hacer, en Argentina, el jean que siempre quisimos usar. Sin atajos, sin temporada de descarte, sin depender de una moda que cambia cada tres meses.\n\nCreemos en el trabajo bien hecho y en la ropa que mejora con los años. Un buen jean no se compra seguido: se elige una vez y se usa hasta que se vuelve tuyo."
  ),
  "lamarca.s1.title": c("Diseño"),
  "lamarca.s1.body": c(
    "Cada corte se prueba, se ajusta y se vuelve a probar hasta que cae como tiene que caer. Buscamos siluetas que no cansen: modernas, cómodas y atemporales."
  ),
  "lamarca.s1.image": c(null, "/demo/hero.jpg"),
  "lamarca.s2.title": c("Materiales"),
  "lamarca.s2.body": c(
    "Trabajamos con denim de gramaje alto, avíos metálicos y costuras reforzadas. Materiales seleccionados para que la prenda resista el uso real de todos los días."
  ),
  "lamarca.s2.image": c(null, "/demo/texture.jpg"),
  "lamarca.quote": c("Menos moda, más propósito. Calidad que se siente."),

  // --- Página HECHO EN ARGENTINA ---
  "hecho.hero.eyebrow": c("Hecho en Argentina"),
  "hecho.hero.title": c("Diseñado, fabricado y pensado para durar."),
  "hecho.hero.image": c(null, "/demo/atelier.jpg"),
  "hecho.intro": c(
    "No es una etiqueta: es cómo trabajamos. Diseñamos y fabricamos en Argentina, con talleres locales y gente que sabe lo que hace."
  ),
  "hecho.b1.title": c("Diseñado acá"),
  "hecho.b1.body": c("El proceso empieza en nuestro taller. Moldería propia, pruebas de calce y ajustes hasta llegar al corte final."),
  "hecho.b1.image": c(null, "/demo/hero.jpg"),
  "hecho.b2.title": c("Fabricado acá"),
  "hecho.b2.body": c("Confeccionistas argentinos, tanda a tanda. El trabajo bien hecho sostiene a personas reales."),
  "hecho.b2.image": c(null, "/demo/atelier.jpg"),
  "hecho.b3.title": c("Seleccionado para durar"),
  "hecho.b3.body": c("Denim de gramaje alto, costuras dobles y avíos que aguantan. Nada decorativo: todo pensado para el uso."),
  "hecho.b3.image": c(null, "/demo/texture.jpg"),
};

export const defaultSizeGuide = {
  name: "Jeans",
  columns: ["Talle", "Cintura (cm)", "Cadera (cm)", "Largo (cm)"],
  rows: [
    ["38", "76", "92", "100"],
    ["40", "80", "96", "102"],
    ["42", "84", "100", "104"],
    ["44", "88", "104", "106"],
    ["46", "92", "108", "108"],
  ],
};

export const defaultSizes: Size[] = [
  { id: "s38", label: "38", position: 1 },
  { id: "s40", label: "40", position: 2 },
  { id: "s42", label: "42", position: 3 },
  { id: "s44", label: "44", position: 4 },
  { id: "s46", label: "46", position: 5 },
];

function demoVariants(colorId: string, skuBase: string) {
  return defaultSizes.map((s) => ({
    id: `${colorId}-${s.label}`,
    product_color_id: colorId,
    size_id: s.id,
    size_label: s.label,
    size_position: s.position,
    sku: `${skuBase}-${s.label}`,
    stock: s.label === "38" || s.label === "46" ? 0 : 6,
    price_override: null,
    is_active: true,
  }));
}

export const demoProducts: Product[] = [
  {
    id: "p-relaxed",
    name: "Jean Relaxed",
    slug: "jean-relaxed",
    short_description: "Corte relajado en índigo profundo, para todos los días.",
    description:
      "El Jean Relaxed cae holgado sin perder forma. Denim de gramaje alto, costuras reforzadas y avíos metálicos pensados para durar años.",
    composition: "100% algodón · 14.5 oz",
    price: 95000,
    compare_at_price: null,
    is_featured: true,
    is_new: true,
    is_bestseller: false,
    fit: { id: "f-relaxed", name: "Relaxed", slug: "relaxed" },
    category: { id: "c-jeans", name: "Jeans", slug: "jeans", parent_id: null },
    cover_url: "/demo/lifestyle.jpg",
    colors: [
      {
        id: "pc-rel-indigo",
        name: "Índigo Raw",
        hex: "#1E3B63",
        sku_base: "JEAN-REL-IND",
        price_override: null,
        position: 1,
        images: [
          { id: "i1", product_color_id: "pc-rel-indigo", url: "/demo/lifestyle.jpg", alt: "Jean Relaxed Índigo — frente", position: 0, is_cover: true },
          { id: "i2", product_color_id: "pc-rel-indigo", url: "/demo/hero.jpg", alt: "Jean Relaxed Índigo — look", position: 1, is_cover: false },
          { id: "i3", product_color_id: "pc-rel-indigo", url: "/demo/detail.jpg", alt: "Jean Relaxed Índigo — detalle", position: 2, is_cover: false },
          { id: "i4", product_color_id: "pc-rel-indigo", url: "/demo/texture.jpg", alt: "Jean Relaxed Índigo — textura", position: 3, is_cover: false },
        ],
        variants: demoVariants("pc-rel-indigo", "JEAN-REL-IND"),
      },
      {
        id: "pc-rel-negro",
        name: "Negro",
        hex: "#0D1326",
        sku_base: "JEAN-REL-NEG",
        price_override: null,
        position: 2,
        images: [
          { id: "i5", product_color_id: "pc-rel-negro", url: "/demo/hero.jpg", alt: "Jean Relaxed Negro — frente", position: 0, is_cover: true },
          { id: "i6", product_color_id: "pc-rel-negro", url: "/demo/detail.jpg", alt: "Jean Relaxed Negro — detalle", position: 1, is_cover: false },
        ],
        variants: demoVariants("pc-rel-negro", "JEAN-REL-NEG"),
      },
    ],
  },
  {
    id: "p-straight",
    name: "Jean Straight",
    slug: "jean-straight",
    short_description: "Corte recto clásico, cómodo y atemporal.",
    description:
      "El Jean Straight es el corte de siempre, bien resuelto. Cae parejo desde la cadera al ruedo, con la robustez del denim argentino.",
    composition: "98% algodón · 2% elastano · 13 oz",
    price: 89000,
    compare_at_price: null,
    is_featured: true,
    is_new: false,
    is_bestseller: true,
    fit: { id: "f-straight", name: "Straight", slug: "straight" },
    category: { id: "c-jeans", name: "Jeans", slug: "jeans", parent_id: null },
    cover_url: "/demo/product.jpg",
    colors: [
      {
        id: "pc-str-gris",
        name: "Gris Stone",
        hex: "#4A4A4A",
        sku_base: "JEAN-STR-GRI",
        price_override: null,
        position: 1,
        images: [
          { id: "i7", product_color_id: "pc-str-gris", url: "/demo/product.jpg", alt: "Jean Straight Gris — frente", position: 0, is_cover: true },
          { id: "i8", product_color_id: "pc-str-gris", url: "/demo/detail.jpg", alt: "Jean Straight Gris — detalle", position: 1, is_cover: false },
          { id: "i9", product_color_id: "pc-str-gris", url: "/demo/texture.jpg", alt: "Jean Straight Gris — textura", position: 2, is_cover: false },
        ],
        variants: demoVariants("pc-str-gris", "JEAN-STR-GRI"),
      },
      {
        id: "pc-str-azul",
        name: "Azul Stone",
        hex: "#2A4E7E",
        sku_base: "JEAN-STR-AZU",
        price_override: null,
        position: 2,
        images: [
          { id: "i10", product_color_id: "pc-str-azul", url: "/demo/lifestyle.jpg", alt: "Jean Straight Azul — frente", position: 0, is_cover: true },
          { id: "i11", product_color_id: "pc-str-azul", url: "/demo/detail.jpg", alt: "Jean Straight Azul — detalle", position: 1, is_cover: false },
        ],
        variants: demoVariants("pc-str-azul", "JEAN-STR-AZU"),
      },
    ],
  },
];

export const demoReels: Reel[] = [
  { id: "r1", instagram_url: "https://instagram.com/mazover", poster_url: "/demo/hero.jpg", caption: "El Relaxed en la calle, todos los días.", product_slug: "jean-relaxed" },
  { id: "r2", instagram_url: "https://instagram.com/mazover", poster_url: "/demo/lifestyle.jpg", caption: "Cómo cae el corte recto en movimiento.", product_slug: "jean-straight" },
  { id: "r3", instagram_url: "https://instagram.com/mazover", poster_url: "/demo/detail.jpg", caption: "Costuras y avíos, de cerca.", product_slug: null },
  { id: "r4", instagram_url: "https://instagram.com/mazover", poster_url: "/demo/atelier.jpg", caption: "Así se hace un jean en el taller.", product_slug: null },
];

export const demoMainMenu: MenuItem[] = [
  { id: "m-inicio", label: "Inicio", link_type: "url", link_ref: "/", image_url: null, column_group: null, children: [] },
  {
    id: "m-coll",
    label: "Colección",
    link_type: "url",
    link_ref: "/productos",
    image_url: null,
    column_group: null,
    children: [
      { id: "mc1", label: "Slim", link_type: "fit", link_ref: "slim", image_url: null, column_group: "Por corte", children: [] },
      { id: "mc2", label: "Straight", link_type: "fit", link_ref: "straight", image_url: null, column_group: "Por corte", children: [] },
      { id: "mc3", label: "Relaxed", link_type: "fit", link_ref: "relaxed", image_url: null, column_group: "Por corte", children: [] },
      { id: "mc4", label: "Loose", link_type: "fit", link_ref: "loose", image_url: null, column_group: "Por corte", children: [] },
      { id: "mc5", label: "Tapered", link_type: "fit", link_ref: "tapered", image_url: null, column_group: "Por corte", children: [] },
      { id: "mc6", label: "Jeans", link_type: "category", link_ref: "jeans", image_url: null, column_group: "Categorías", children: [] },
      { id: "mc7", label: "Camisas", link_type: "category", link_ref: "camisas", image_url: null, column_group: "Categorías", children: [] },
      { id: "mc8", label: "Chinos", link_type: "category", link_ref: "chinos", image_url: null, column_group: "Categorías", children: [] },
      { id: "mc9", label: "Camperas", link_type: "category", link_ref: "camperas", image_url: null, column_group: "Categorías", children: [] },
      { id: "mc10", label: "Accesorios", link_type: "category", link_ref: "accesorios", image_url: null, column_group: "Categorías", children: [] },
      { id: "mc11", label: "Nueva temporada", link_type: "collection", link_ref: "nueva-temporada", image_url: null, column_group: "Colecciones", children: [] },
      { id: "mc12", label: "Índigo Raw", link_type: "collection", link_ref: "indigo-raw", image_url: null, column_group: "Colecciones", children: [] },
      { id: "mc13", label: "Clásicos", link_type: "collection", link_ref: "clasicos", image_url: null, column_group: "Colecciones", children: [] },
      { id: "mc14", label: "Jean Relaxed Índigo", link_type: "product", link_ref: "jean-relaxed", image_url: "/demo/lifestyle.jpg", column_group: "Destacado", children: [] },
    ],
  },
  { id: "m-nosotros", label: "Nosotros", link_type: "page", link_ref: "la-marca", image_url: null, column_group: null, children: [] },
  { id: "m-guia", label: "Guía de talles", link_type: "url", link_ref: "/productos", image_url: null, column_group: null, children: [] },
  { id: "m-contacto", label: "Contacto", link_type: "url", link_ref: "https://wa.me/5491100000000", image_url: null, column_group: null, children: [] },
];

/** Resuelve el href de un ítem de menú según su tipo. */
export function menuHref(item: Pick<MenuItem, "link_type" | "link_ref">): string {
  const ref = item.link_ref ?? "";
  switch (item.link_type) {
    case "category": return `/productos?categoria=${ref}`;
    case "fit": return `/productos?corte=${ref}`;
    case "collection": return `/productos?coleccion=${ref}`;
    case "product": return `/productos/${ref}`;
    case "page": return `/${ref}`;
    default: return ref || "#";
  }
}

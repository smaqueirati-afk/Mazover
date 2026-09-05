import "server-only";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type {
  Settings,
  ContentMap,
  Product,
  Reel,
  MenuItem,
} from "@/lib/types";
import {
  defaultSettings,
  defaultContent,
  demoProducts,
  demoReels,
  demoMainMenu,
  defaultSizeGuide,
} from "@/content/defaults";

export type SizeGuide = { name: string; columns: string[]; rows: string[][] };

// ---------------------------------------------------------------------------
// Cada getter usa Supabase si está configurado; si no, cae en los defaults.
// El contenido siempre se mezcla sobre los defaults para no dejar claves vacías.
// ---------------------------------------------------------------------------

export async function getSettings(): Promise<Settings> {
  if (!isSupabaseConfigured()) return defaultSettings;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("settings").select("*").limit(1).single();
    return data ? { ...defaultSettings, ...data } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export async function getContent(): Promise<ContentMap> {
  if (!isSupabaseConfigured()) return defaultContent;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("content_blocks")
      .select("key, value, image_url");
    const map: ContentMap = { ...defaultContent };
    (data ?? []).forEach((b) => {
      map[b.key] = { value: b.value, image_url: b.image_url };
    });
    return map;
  } catch {
    return defaultContent;
  }
}

// Convierte filas planas de Supabase en el árbol de Product.
type Row = Record<string, unknown>;
function shapeProducts(rows: Row[]): Product[] {
  return rows.map((p) => {
    const colors = ((p.product_colors as Row[]) ?? [])
      .sort((a, b) => (a.position as number) - (b.position as number))
      .map((pc) => ({
        id: pc.id as string,
        name: pc.name as string,
        hex: pc.hex as string,
        sku_base: (pc.sku_base as string) ?? null,
        price_override: (pc.price_override as number) ?? null,
        position: pc.position as number,
        images: (((pc.product_images as Row[]) ?? []) as Row[])
          .map((i) => ({
            id: i.id as string,
            product_color_id: (i.product_color_id as string) ?? null,
            url: i.url as string,
            alt: (i.alt as string) ?? null,
            position: i.position as number,
            is_cover: i.is_cover as boolean,
          }))
          .sort((a, b) => a.position - b.position),
        variants: (((pc.product_variants as Row[]) ?? []) as Row[])
          .map((v) => ({
            id: v.id as string,
            product_color_id: v.product_color_id as string,
            size_id: v.size_id as string,
            size_label: ((v.sizes as Row)?.label as string) ?? "",
            size_position: ((v.sizes as Row)?.position as number) ?? 0,
            sku: (v.sku as string) ?? null,
            stock: (v.stock as number) ?? 0,
            price_override: (v.price_override as number) ?? null,
            is_active: v.is_active as boolean,
          }))
          .sort((a, b) => a.size_position - b.size_position),
      }));
    const cover =
      colors[0]?.images.find((i) => i.is_cover)?.url ??
      colors[0]?.images[0]?.url ??
      null;
    return {
      id: p.id as string,
      name: p.name as string,
      slug: p.slug as string,
      short_description: (p.short_description as string) ?? null,
      description: (p.description as string) ?? null,
      composition: (p.composition as string) ?? null,
      price: (p.price as number) ?? 0,
      compare_at_price: (p.compare_at_price as number) ?? null,
      is_featured: (p.is_featured as boolean) ?? false,
      is_new: (p.is_new as boolean) ?? false,
      is_bestseller: (p.is_bestseller as boolean) ?? false,
      fit: (p.fits as Product["fit"]) ?? null,
      category: (p.categories as Product["category"]) ?? null,
      colors,
      cover_url: cover,
    } as Product;
  });
}

const PRODUCT_SELECT = `
  *,
  fits(id,name,slug),
  categories(id,name,slug,parent_id),
  product_colors(*, product_images(*), product_variants(*, sizes(label,position)))
`;

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return demoProducts.filter((p) => p.is_featured);
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("position");
    return shapeProducts((data as Row[]) ?? []);
  } catch {
    return [];
  }
}

export async function getReels(): Promise<Reel[]> {
  if (!isSupabaseConfigured()) return demoReels;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("instagram_reels")
      .select("id, instagram_url, poster_url, caption, products(slug)")
      .eq("is_active", true)
      .order("position");
    return ((data as Row[]) ?? []).map((r) => ({
      id: r.id as string,
      instagram_url: r.instagram_url as string,
      poster_url: (r.poster_url as string) ?? null,
      caption: (r.caption as string) ?? null,
      product_slug: ((r.products as Row)?.slug as string) ?? null,
    }));
  } catch {
    return [];
  }
}

export async function getMainMenu(): Promise<MenuItem[]> {
  if (!isSupabaseConfigured()) return demoMainMenu;
  try {
    const supabase = await createClient();
    const { data: menu } = await supabase
      .from("menus")
      .select("id")
      .eq("handle", "main")
      .single();
    if (!menu) return demoMainMenu;
    const { data: items } = await supabase
      .from("menu_items")
      .select("*")
      .eq("menu_id", menu.id)
      .eq("is_active", true)
      .order("position");
    const rows = (items as Row[]) ?? [];
    const byId = new Map<string, MenuItem>();
    rows.forEach((r) =>
      byId.set(r.id as string, {
        id: r.id as string,
        label: r.label as string,
        link_type: r.link_type as MenuItem["link_type"],
        link_ref: (r.link_ref as string) ?? null,
        image_url: (r.image_url as string) ?? null,
        column_group: (r.column_group as string) ?? null,
        children: [],
      })
    );
    const roots: MenuItem[] = [];
    rows.forEach((r) => {
      const node = byId.get(r.id as string)!;
      const parent = r.parent_id ? byId.get(r.parent_id as string) : null;
      if (parent) parent.children.push(node);
      else roots.push(node);
    });
    return roots.length ? roots : demoMainMenu;
  } catch {
    return demoMainMenu;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured())
    return demoProducts.find((p) => p.slug === slug) ?? null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", slug)
      .eq("is_active", true)
      .single();
    if (!data) return null;
    return shapeProducts([data as Row])[0] ?? null;
  } catch {
    return null;
  }
}

export async function getSizeGuide(categoryId?: string | null): Promise<SizeGuide> {
  if (!isSupabaseConfigured()) return defaultSizeGuide;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("size_guides")
      .select("name, category_id, columns, rows")
      .eq("is_active", true);
    const rows = (data as Row[]) ?? [];
    if (rows.length === 0) return defaultSizeGuide;
    const match =
      (categoryId && rows.find((r) => r.category_id === categoryId)) ||
      rows.find((r) => !r.category_id) ||
      rows[0];
    return {
      name: match.name as string,
      columns: (match.columns as string[]) ?? defaultSizeGuide.columns,
      rows: (match.rows as string[][]) ?? [],
    };
  } catch {
    return defaultSizeGuide;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return demoProducts;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("is_active", true)
      .order("position");
    return shapeProducts((data as Row[]) ?? []);
  } catch {
    return [];
  }
}

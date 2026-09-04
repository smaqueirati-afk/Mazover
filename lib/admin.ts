import "server-only";
import { createClient } from "@/lib/supabase/server";

export type AdminColor = {
  id: string; name: string; hex: string; internal_code: string | null;
  sku_base: string | null; price_override: number | null; position: number; is_active: boolean;
  images: { id: string; url: string; alt: string | null; position: number; is_cover: boolean }[];
  variants: { id: string; size_id: string; stock: number; sku: string | null; is_active: boolean }[];
};

export type AdminProduct = {
  id: string; name: string; slug: string; short_description: string | null; description: string | null;
  category_id: string | null; fit_id: string | null; composition: string | null;
  price: number; compare_at_price: number | null;
  is_featured: boolean; is_new: boolean; is_bestseller: boolean; is_active: boolean; position: number;
  seo_title: string | null; seo_description: string | null;
  colors: AdminColor[];
};

export async function listAdminProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, price, is_active, is_featured, product_colors(id, product_images(url, is_cover), product_variants(stock))")
    .order("position");
  return (data ?? []).map((p) => {
    const colors = (p.product_colors as { id: string; product_images?: { url: string; is_cover: boolean }[]; product_variants?: { stock: number }[] }[]) ?? [];
    let stock = 0;
    let cover: string | null = null;
    for (const c of colors) {
      for (const v of c.product_variants ?? []) stock += v.stock;
      if (!cover) cover = c.product_images?.find((i) => i.is_cover)?.url ?? c.product_images?.[0]?.url ?? null;
    }
    return {
      id: p.id as string, name: p.name as string, slug: p.slug as string,
      price: p.price as number, is_active: p.is_active as boolean, is_featured: p.is_featured as boolean,
      colors: colors.length, stock, cover,
    };
  });
}

export async function getAdminProduct(id: string): Promise<AdminProduct | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, product_colors(*, product_images(*), product_variants(*))")
    .eq("id", id)
    .single();
  if (!data) return null;
  const colors = ((data.product_colors as Record<string, unknown>[]) ?? [])
    .map((c) => ({
      id: c.id as string, name: c.name as string, hex: c.hex as string,
      internal_code: (c.internal_code as string) ?? null, sku_base: (c.sku_base as string) ?? null,
      price_override: (c.price_override as number) ?? null, position: c.position as number, is_active: c.is_active as boolean,
      images: ((c.product_images as Record<string, unknown>[]) ?? []).map((i) => ({
        id: i.id as string, url: i.url as string, alt: (i.alt as string) ?? null,
        position: i.position as number, is_cover: i.is_cover as boolean,
      })).sort((a, b) => a.position - b.position),
      variants: ((c.product_variants as Record<string, unknown>[]) ?? []).map((v) => ({
        id: v.id as string, size_id: v.size_id as string, stock: (v.stock as number) ?? 0,
        sku: (v.sku as string) ?? null, is_active: v.is_active as boolean,
      })),
    }))
    .sort((a, b) => a.position - b.position);
  return { ...(data as unknown as AdminProduct), colors };
}

export async function getTaxonomies() {
  const supabase = await createClient();
  const [{ data: categories }, { data: fits }, { data: sizes }, { data: colors }] = await Promise.all([
    supabase.from("categories").select("id, name").order("position"),
    supabase.from("fits").select("id, name").order("position"),
    supabase.from("sizes").select("id, label, position").order("position"),
    supabase.from("colors").select("id, name, hex").order("position"),
  ]);
  return { categories: categories ?? [], fits: fits ?? [], sizes: sizes ?? [], colors: colors ?? [] };
}

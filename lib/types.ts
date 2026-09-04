// Tipos de dominio (espejo del esquema de Supabase).

export type Settings = {
  brand_name: string;
  brand_tagline: string;
  logo_url: string | null;
  whatsapp_number: string | null;
  whatsapp_message: string | null;
  instagram_url: string | null;
  instagram_handle: string | null;
  email: string | null;
  address: string | null;
  color_ink: string;
  color_surface: string;
  color_blue: string;
  color_celeste: string;
  color_sand: string;
  color_red: string;
  seo_title: string | null;
  seo_description: string | null;
  seo_og_image: string | null;
  currency: string;
  currency_symbol: string;
};

export type ContentMap = Record<string, { value: string | null; image_url: string | null }>;

export type Fit = { id: string; name: string; slug: string };
export type Category = { id: string; name: string; slug: string; parent_id: string | null };
export type Size = { id: string; label: string; position: number };

export type ProductImage = {
  id: string;
  product_color_id: string | null;
  url: string;
  alt: string | null;
  position: number;
  is_cover: boolean;
};

export type ProductVariant = {
  id: string;
  product_color_id: string;
  size_id: string;
  size_label: string;
  size_position: number;
  sku: string | null;
  stock: number;
  price_override: number | null;
  is_active: boolean;
};

export type ProductColor = {
  id: string;
  name: string;
  hex: string;
  sku_base: string | null;
  price_override: number | null;
  position: number;
  images: ProductImage[];
  variants: ProductVariant[];
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  composition: string | null;
  price: number;
  compare_at_price: number | null;
  is_featured: boolean;
  is_new: boolean;
  is_bestseller: boolean;
  fit?: Fit | null;
  category?: Category | null;
  colors: ProductColor[];
  cover_url: string | null;
};

export type Reel = {
  id: string;
  instagram_url: string;
  poster_url: string | null;
  caption: string | null;
  product_slug: string | null;
};

export type MenuItem = {
  id: string;
  label: string;
  link_type: "category" | "collection" | "product" | "page" | "fit" | "url";
  link_ref: string | null;
  image_url: string | null;
  column_group: string | null;
  children: MenuItem[];
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  colorName: string;
  sizeLabel: string;
  price: number;
  qty: number;
  image: string | null;
};

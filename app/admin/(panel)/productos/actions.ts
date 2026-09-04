"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionState = { ok: boolean; msg: string; id?: string } | null;

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
const num = (v: FormDataEntryValue | null) => (v === null || v === "" ? null : Number(v));

export async function upsertProductInfo(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, msg: "El nombre es obligatorio." };
  const slug = String(formData.get("slug") ?? "").trim() || slugify(name);

  const payload = {
    name, slug,
    short_description: String(formData.get("short_description") ?? "") || null,
    description: String(formData.get("description") ?? "") || null,
    category_id: (formData.get("category_id") as string) || null,
    fit_id: (formData.get("fit_id") as string) || null,
    composition: String(formData.get("composition") ?? "") || null,
    price: num(formData.get("price")) ?? 0,
    compare_at_price: num(formData.get("compare_at_price")),
    is_featured: formData.get("is_featured") === "on",
    is_new: formData.get("is_new") === "on",
    is_bestseller: formData.get("is_bestseller") === "on",
    is_active: formData.get("is_active") === "on",
    position: num(formData.get("position")) ?? 0,
    seo_title: String(formData.get("seo_title") ?? "") || null,
    seo_description: String(formData.get("seo_description") ?? "") || null,
  };

  let newId = id;
  if (id) {
    const { error } = await supabase.from("products").update(payload).eq("id", id);
    if (error) return { ok: false, msg: error.message };
  } else {
    const { data, error } = await supabase.from("products").insert(payload).select("id").single();
    if (error) return { ok: false, msg: error.message };
    newId = data.id;
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin/productos");
  if (!id) redirect(`/admin/productos/${newId}`);
  return { ok: true, msg: "Producto guardado.", id: newId };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}

export async function addColor(productId: string, name: string, hex: string, skuBase: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("product_colors").insert({
    product_id: productId, name, hex, sku_base: skuBase || null,
  });
  revalidatePath(`/admin/productos/${productId}`);
  return error ? { ok: false, msg: error.message } : { ok: true, msg: "Color agregado." };
}

export async function updateColor(colorId: string, productId: string, patch: { name?: string; hex?: string; sku_base?: string | null; internal_code?: string | null; is_active?: boolean }) {
  const supabase = await createClient();
  const { error } = await supabase.from("product_colors").update(patch).eq("id", colorId);
  revalidatePath(`/admin/productos/${productId}`);
  return error ? { ok: false, msg: error.message } : { ok: true, msg: "Color actualizado." };
}

export async function deleteColor(colorId: string, productId: string) {
  const supabase = await createClient();
  await supabase.from("product_colors").delete().eq("id", colorId);
  revalidatePath(`/admin/productos/${productId}`);
}

export async function saveStock(
  productId: string,
  rows: { product_color_id: string; size_id: string; stock: number; sku: string | null }[]
) {
  const supabase = await createClient();
  const payload = rows.map((r) => ({ ...r, product_id: productId, is_active: true }));
  const { error } = await supabase
    .from("product_variants")
    .upsert(payload, { onConflict: "product_color_id,size_id" });
  revalidatePath(`/admin/productos/${productId}`);
  revalidatePath("/", "layout");
  return error ? { ok: false, msg: error.message } : { ok: true, msg: "Stock guardado." };
}

export async function attachImage(productId: string, colorId: string, url: string, isCover: boolean) {
  const supabase = await createClient();
  if (isCover) await supabase.from("product_images").update({ is_cover: false }).eq("product_color_id", colorId);
  const { error } = await supabase.from("product_images").insert({
    product_id: productId, product_color_id: colorId, url, is_cover: isCover,
  });
  revalidatePath(`/admin/productos/${productId}`);
  revalidatePath("/", "layout");
  return error ? { ok: false, msg: error.message } : { ok: true, msg: "Imagen agregada." };
}

export async function deleteImage(imageId: string, productId: string) {
  const supabase = await createClient();
  await supabase.from("product_images").delete().eq("id", imageId);
  revalidatePath(`/admin/productos/${productId}`);
}

export async function setCover(imageId: string, colorId: string, productId: string) {
  const supabase = await createClient();
  await supabase.from("product_images").update({ is_cover: false }).eq("product_color_id", colorId);
  await supabase.from("product_images").update({ is_cover: true }).eq("id", imageId);
  revalidatePath(`/admin/productos/${productId}`);
  revalidatePath("/", "layout");
}

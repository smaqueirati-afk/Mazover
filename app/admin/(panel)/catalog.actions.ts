"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Res = { ok: boolean; msg: string };

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function revalidateAll() {
  revalidatePath("/", "layout");
}

async function upsert(table: string, row: Record<string, unknown>): Promise<Res> {
  const supabase = await createClient();
  const id = row.id as string | undefined;
  const res = id
    ? await supabase.from(table).update(row).eq("id", id)
    : await supabase.from(table).insert(row);
  revalidateAll();
  return res.error ? { ok: false, msg: res.error.message } : { ok: true, msg: "Guardado." };
}

export async function deleteRow(table: string, id: string): Promise<Res> {
  const supabase = await createClient();
  const res = await supabase.from(table).delete().eq("id", id);
  revalidateAll();
  return res.error ? { ok: false, msg: res.error.message } : { ok: true, msg: "Eliminado." };
}

type Obj = Record<string, unknown>;
export async function saveCategory(input: Obj) {
  return upsert("categories", { ...input, slug: (input.slug as string) || slugify(String(input.name ?? "")) });
}
export async function saveColor(input: Obj) {
  return upsert("colors", { ...input, slug: (input.slug as string) || slugify(String(input.name ?? "")) });
}
export async function saveSize(input: Obj) {
  return upsert("sizes", input);
}
export async function saveReel(input: { id?: string; instagram_url: string; poster_url: string | null; caption: string | null; product_id: string | null; position: number; is_active: boolean }) {
  return upsert("instagram_reels", input);
}
export async function saveMenuItem(input: { id?: string; menu_id: string; parent_id: string | null; label: string; link_type: string; link_ref: string | null; column_group: string | null; position: number; is_active: boolean }) {
  return upsert("menu_items", input);
}

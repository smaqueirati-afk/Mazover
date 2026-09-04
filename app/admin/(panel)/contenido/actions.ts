"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ActionState = { ok: boolean; msg: string } | null;

export async function updateContent(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  let keys: string[] = [];
  try { keys = JSON.parse(String(formData.get("__keys") ?? "[]")); } catch {}

  for (const key of keys) {
    const value = formData.get(key);
    const img = formData.get(`${key}__img`);
    const patch: Record<string, string | null> = {};
    if (value !== null) patch.value = String(value);
    if (img !== null) patch.image_url = String(img) || null;
    if (Object.keys(patch).length === 0) continue;
    const { error } = await supabase.from("content_blocks").update(patch).eq("key", key);
    if (error) return { ok: false, msg: `Error en ${key}: ${error.message}` };
  }

  revalidatePath("/", "layout");
  return { ok: true, msg: "Contenido guardado." };
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const FIELDS = [
  "brand_name", "brand_tagline", "whatsapp_number", "whatsapp_message",
  "instagram_url", "instagram_handle", "email", "address",
  "color_ink", "color_blue", "color_celeste", "color_surface", "color_sand", "color_red",
  "seo_title", "seo_description", "currency_symbol", "logo_url",
];

export type ActionState = { ok: boolean; msg: string } | null;

export async function updateSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { data: row } = await supabase.from("settings").select("id").limit(1).maybeSingle();

  const update: Record<string, string> = {};
  for (const f of FIELDS) {
    const v = formData.get(f);
    if (v !== null) update[f] = String(v);
  }

  const res = row?.id
    ? await supabase.from("settings").update(update).eq("id", row.id)
    : await supabase.from("settings").insert(update);

  if (res.error) return { ok: false, msg: res.error.message };

  revalidatePath("/", "layout");
  return { ok: true, msg: "Configuración guardada." };
}

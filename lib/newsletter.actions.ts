"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type SubscribeResult = { ok: boolean; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Suscribe un email al newsletter (tabla `subscribers`).
 * Los duplicados se tratan como éxito ("ya estás en la lista").
 */
export async function subscribeNewsletter(input: {
  email: string;
  source?: string;
}): Promise<SubscribeResult> {
  const email = (input.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: "Ingresá un email válido." };
  }

  if (!isSupabaseConfigured()) {
    return { ok: true, message: "¡Listo! Ya estás suscripto." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("subscribers").insert({
      email,
      source: input.source ?? "newsletter",
    });
    if (error) {
      // 23505 = unique violation → el email ya estaba suscripto.
      if (error.code === "23505") {
        return { ok: true, message: "¡Ya estabas en la lista! Gracias." };
      }
      return { ok: false, message: "No pudimos suscribirte. Probá de nuevo." };
    }
    return { ok: true, message: "¡Listo! Vas a recibir nuestras novedades." };
  } catch {
    return { ok: false, message: "No pudimos suscribirte. Probá de nuevo." };
  }
}

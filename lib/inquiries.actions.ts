"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type RestockResult = { ok: boolean; message: string };

/**
 * Registra un aviso de reposición ("Avisame cuando vuelva") en `inquiries`.
 * source = 'restock'. El dueño lo ve en el panel → Consultas.
 */
export async function notifyRestock(input: {
  productName: string;
  colorName: string;
  sizeLabel: string;
  name?: string;
  contact: string;
}): Promise<RestockResult> {
  const contact = input.contact?.trim() ?? "";
  if (contact.length < 5) {
    return { ok: false, message: "Dejanos un WhatsApp o email válido." };
  }

  if (!isSupabaseConfigured()) {
    // Modo demo: no hay base, respondemos con éxito simulado.
    return { ok: true, message: "¡Listo! Te vamos a avisar cuando vuelva." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("inquiries").insert({
      source: "restock",
      customer_name: input.name?.trim() || null,
      customer_phone: contact,
      items: [
        {
          name: input.productName,
          colorName: input.colorName,
          sizeLabel: input.sizeLabel,
          qty: 1,
        },
      ],
    });
    if (error) return { ok: false, message: "No pudimos registrar el aviso. Probá de nuevo." };
    return { ok: true, message: "¡Listo! Te vamos a avisar cuando vuelva." };
  } catch {
    return { ok: false, message: "No pudimos registrar el aviso. Probá de nuevo." };
  }
}

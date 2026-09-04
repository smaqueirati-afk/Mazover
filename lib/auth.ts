import "server-only";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function getSessionUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

/** Devuelve el usuario si está logueado y es admin; si no, null. */
export async function getAdminUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, email, full_name")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) return null;
  return { ...user, profile };
}

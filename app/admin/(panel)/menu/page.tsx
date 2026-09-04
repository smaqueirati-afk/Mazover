import { createClient } from "@/lib/supabase/server";
import MenuEditor from "@/components/admin/MenuEditor";

export default async function MenuPage() {
  const supabase = await createClient();
  let { data: menu } = await supabase.from("menus").select("id").eq("handle", "main").maybeSingle();
  if (!menu) {
    const ins = await supabase.from("menus").insert({ handle: "main", name: "Menú principal" }).select("id").single();
    menu = ins.data;
  }
  const { data: items } = await supabase
    .from("menu_items")
    .select("id, menu_id, parent_id, label, link_type, link_ref, column_group, position, is_active")
    .eq("menu_id", menu!.id)
    .order("position");

  return <MenuEditor menuId={menu!.id} items={items ?? []} />;
}

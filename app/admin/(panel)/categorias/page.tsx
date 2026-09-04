import { createClient } from "@/lib/supabase/server";
import CatalogCrud from "@/components/admin/CatalogCrud";
import { saveCategory } from "../catalog.actions";

export default async function CategoriasPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("id, name, slug, position, is_active").order("position");
  return (
    <CatalogCrud
      title="Categorías"
      subtitle="Jeans, Camisas, Chinos… Se usan en los productos y el menú."
      table="categories"
      fields={[{ key: "name", label: "Nombre" }, { key: "position", label: "Orden", type: "number" }, { key: "is_active", label: "Activa", type: "bool" }]}
      rows={data ?? []}
      save={saveCategory}
      newDefaults={{ name: "", position: (data?.length ?? 0) + 1, is_active: true }}
    />
  );
}

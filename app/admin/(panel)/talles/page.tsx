import { createClient } from "@/lib/supabase/server";
import CatalogCrud from "@/components/admin/CatalogCrud";
import { saveSize } from "../catalog.actions";

export default async function TallesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("sizes").select("id, label, position, is_active").order("position");
  return (
    <CatalogCrud
      title="Talles"
      subtitle="Se usan en la matriz de stock de cada producto."
      table="sizes"
      fields={[{ key: "label", label: "Talle" }, { key: "position", label: "Orden", type: "number" }, { key: "is_active", label: "Activo", type: "bool" }]}
      rows={data ?? []}
      save={saveSize}
      newDefaults={{ label: "", position: (data?.length ?? 0) + 1, is_active: true }}
    />
  );
}

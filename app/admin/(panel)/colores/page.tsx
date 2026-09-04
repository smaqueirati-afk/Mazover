import { createClient } from "@/lib/supabase/server";
import CatalogCrud from "@/components/admin/CatalogCrud";
import { saveColor } from "../catalog.actions";

export default async function ColoresPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("colors").select("id, name, hex, position, is_active").order("position");
  return (
    <CatalogCrud
      title="Colores"
      subtitle="Paleta reutilizable. Los colores por producto (con galería y stock) se editan dentro de cada producto."
      table="colors"
      fields={[{ key: "name", label: "Nombre" }, { key: "hex", label: "Color", type: "color" }, { key: "position", label: "Orden", type: "number" }, { key: "is_active", label: "Activo", type: "bool" }]}
      rows={data ?? []}
      save={saveColor}
      newDefaults={{ name: "", hex: "#1E3B63", position: (data?.length ?? 0) + 1, is_active: true }}
    />
  );
}

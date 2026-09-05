import { createClient } from "@/lib/supabase/server";
import SizeGuidesEditor from "@/components/admin/SizeGuidesEditor";

type Guide = { id: string; name: string; category_id: string | null; columns: string[]; rows: string[][]; is_active: boolean };

export default async function GuiaDeTallesPage() {
  const supabase = await createClient();
  const [{ data: guides }, { data: categories }] = await Promise.all([
    supabase.from("size_guides").select("id, name, category_id, columns, rows, is_active").order("name"),
    supabase.from("categories").select("id, name").order("position"),
  ]);
  return <SizeGuidesEditor guides={(guides ?? []) as Guide[]} categories={categories ?? []} />;
}

import { createClient } from "@/lib/supabase/server";
import ReelsCrud from "@/components/admin/ReelsCrud";

export default async function ReelsPage() {
  const supabase = await createClient();
  const [{ data: reels }, { data: products }] = await Promise.all([
    supabase.from("instagram_reels").select("id, instagram_url, poster_url, caption, product_id, position, is_active").order("position"),
    supabase.from("products").select("id, name").order("name"),
  ]);
  return <ReelsCrud rows={reels ?? []} products={products ?? []} />;
}

import { createClient } from "@/lib/supabase/server";
import SubscribersView from "@/components/admin/SubscribersView";

type Sub = { id: string; email: string; source: string; status: string; created_at: string };

export default async function SuscriptoresPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subscribers")
    .select("id, email, source, status, created_at")
    .order("created_at", { ascending: false })
    .limit(1000);
  return <SubscribersView rows={(data ?? []) as Sub[]} />;
}

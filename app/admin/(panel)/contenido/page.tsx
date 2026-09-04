import { createClient } from "@/lib/supabase/server";
import ContentForm, { type Block } from "./ContentForm";

export default async function ContenidoPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("content_blocks")
    .select("key, section, label, type, value, image_url")
    .order("section")
    .order("position");

  const blocks = (data ?? []) as Block[];

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Contenido</h1>
          <p>Editá cada texto e imagen de las secciones del sitio.</p>
        </div>
      </div>
      {blocks.length === 0 ? (
        <div className="adm-notice">Todavía no hay bloques de contenido. Corré <code>seed.sql</code> en Supabase.</div>
      ) : (
        <ContentForm blocks={blocks} />
      )}
    </>
  );
}

import { getSettings } from "@/lib/data";
import SettingsForm from "./SettingsForm";

export default async function ConfiguracionPage() {
  const settings = await getSettings();
  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Configuración</h1>
          <p>Marca, contacto, colores y SEO. Todo editable, sin tocar código.</p>
        </div>
      </div>
      <SettingsForm settings={settings} />
    </>
  );
}

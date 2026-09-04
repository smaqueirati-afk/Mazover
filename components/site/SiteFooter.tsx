import Link from "next/link";
import BrandMark from "./BrandMark";
import type { Settings, ContentMap } from "@/lib/types";

export default function SiteFooter({
  settings,
  content,
}: {
  settings: Settings;
  content: ContentMap;
}) {
  const about = content["footer.about"]?.value ?? "";
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-top">
          <div>
            <Link href="/" className="logo foot-brand" style={{ color: "#fff" }}>
              <BrandMark size={40} />
              <span className="logo-txt">
                <span className="logo-word">{settings.brand_name}</span>
                <span className="logo-tag">{settings.brand_tagline}</span>
              </span>
            </Link>
            <p className="foot-about">{about}</p>
          </div>
          <div className="foot-col">
            <h4>Tienda</h4>
            <Link href="/productos">Colección</Link>
            <Link href="/productos?categoria=jeans">Jeans</Link>
            <Link href="/productos">Novedades</Link>
          </div>
          <div className="foot-col">
            <h4>La marca</h4>
            <Link href="/la-marca">Nuestra historia</Link>
            <Link href="/hecho-en-argentina">Hecho en Argentina</Link>
          </div>
          <div className="foot-col">
            <h4>Contacto</h4>
            {settings.whatsapp_number && (
              <a href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            )}
            {settings.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer">Instagram</a>
            )}
            {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {year} {settings.brand_name} · {settings.brand_tagline}</span>
          <span>Términos · Privacidad</span>
        </div>
      </div>
    </footer>
  );
}

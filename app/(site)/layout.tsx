import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsappFab from "@/components/site/WhatsappFab";
import { CartProvider } from "@/lib/cart";
import { FavoritesProvider } from "@/lib/favorites";
import { getSettings, getContent, getMainMenu } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, content, menu] = await Promise.all([
    getSettings(),
    getContent(),
    getMainMenu(),
  ]);
  return (
    <FavoritesProvider>
      <CartProvider>
        <SiteHeader menu={menu} settings={settings} />
        <main>{children}</main>
        <SiteFooter settings={settings} content={content} />
        <WhatsappFab settings={settings} />
      </CartProvider>
    </FavoritesProvider>
  );
}

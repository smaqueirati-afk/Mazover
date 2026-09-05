import type { Metadata } from "next";
import { Oswald, Montserrat } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/data";
import SolDefs from "@/components/site/SolDefs";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-mont",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    metadataBase: new URL(base),
    title: {
      default: s.seo_title ?? `${s.brand_name} — ${s.brand_tagline}`,
      template: `%s · ${s.brand_name}`,
    },
    description: s.seo_description ?? undefined,
    openGraph: {
      type: "website",
      title: s.seo_title ?? s.brand_name,
      description: s.seo_description ?? undefined,
      images: s.seo_og_image ? [s.seo_og_image] : undefined,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const s = await getSettings();
  // Colores editables desde el panel → se inyectan como CSS vars.
  const colorVars = `:root{--azul-profundo:${s.color_ink};--azul:${s.color_blue};--celeste:${s.color_celeste};--blanco:${s.color_surface};--arena:${s.color_sand};--rojo:${s.color_red};}`;
  return (
    <html lang="es" className={`${oswald.variable} ${montserrat.variable}`}>
      <body>
        <style dangerouslySetInnerHTML={{ __html: colorVars }} />
        <SolDefs />
        {children}
      </body>
    </html>
  );
}

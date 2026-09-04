import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getSettings, getSizeGuide } from "@/lib/data";
import ProductView from "@/components/site/ProductView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description:
      product.short_description ??
      `${product.name} — denim MAZOVER, hecho en Argentina.`,
    openGraph: {
      title: product.name,
      description: product.short_description ?? undefined,
      images: product.cover_url ? [product.cover_url] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings, sizeGuide] = await Promise.all([
    getProductBySlug(slug),
    getSettings(),
    getSizeGuide(),
  ]);
  if (!product) notFound();

  return (
    <>
      <nav className="wrap" style={{ paddingTop: 108, fontFamily: "var(--oswald)", fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gris)" }} aria-label="Breadcrumb">
        <Link href="/">Inicio</Link> / <Link href="/productos">Colección</Link> / <span style={{ color: "var(--azul-profundo)" }}>{product.name}</span>
      </nav>
      <ProductView product={product} settings={settings} sizeGuide={sizeGuide} />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getSettings, getSizeGuide, getAllProducts, getContent } from "@/lib/data";
import ProductView from "@/components/site/ProductView";
import ProductCard from "@/components/site/ProductCard";

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
  const [product, settings, sizeGuide, all, content] = await Promise.all([
    getProductBySlug(slug),
    getSettings(),
    getSizeGuide(),
    getAllProducts(),
    getContent(),
  ]);
  if (!product) notFound();
  const shipTitle = content["product.ship.title"]?.value ?? "Envíos y cambios";
  const shipBody = content["product.ship.body"]?.value ?? "Coordinamos envíos a todo el país. Cambios dentro de los 30 días con la prenda sin uso. Consultanos por WhatsApp.";

  const sameCat = all.filter((p) => p.slug !== product.slug && p.category?.slug === product.category?.slug);
  const others = all.filter((p) => p.slug !== product.slug && p.category?.slug !== product.category?.slug);
  const related = [...sameCat, ...others].slice(0, 4);

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const inStock = product.colors.some((c) => c.variants.some((v) => v.stock > 0));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description ?? product.description ?? undefined,
    image: product.colors.flatMap((c) => c.images.map((i) => (i.url.startsWith("http") ? i.url : `${base}${i.url}`))).slice(0, 6),
    brand: { "@type": "Brand", name: settings.brand_name },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: settings.currency,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${base}/productos/${product.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="wrap" style={{ paddingTop: 108, fontFamily: "var(--oswald)", fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gris)" }} aria-label="Breadcrumb">
        <Link href="/">Inicio</Link> / <Link href="/productos">Colección</Link> / <span style={{ color: "var(--azul-profundo)" }}>{product.name}</span>
      </nav>
      <ProductView product={product} settings={settings} sizeGuide={sizeGuide} shipTitle={shipTitle} shipBody={shipBody} />

      {related.length > 0 && (
        <section className="section coll">
          <div className="wrap">
            <div className="coll-head">
              <div><span className="eyebrow">Seguí mirando</span><h2>También te puede gustar</h2></div>
            </div>
            <div className="grid-products">
              {related.map((p) => <ProductCard key={p.id} p={p} symbol={settings.currency_symbol} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

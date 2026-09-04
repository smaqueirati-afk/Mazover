import { notFound } from "next/navigation";
import { getAdminProduct, getTaxonomies } from "@/lib/admin";
import ProductEditor from "@/components/admin/ProductEditor";

export default async function EditarProducto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, tax] = await Promise.all([getAdminProduct(id), getTaxonomies()]);
  if (!product) notFound();
  return <ProductEditor product={product} tax={tax} />;
}

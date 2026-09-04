import { getTaxonomies } from "@/lib/admin";
import ProductEditor from "@/components/admin/ProductEditor";

export default async function NuevoProducto() {
  const tax = await getTaxonomies();
  return <ProductEditor product={null} tax={tax} />;
}

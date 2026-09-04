import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import CartView from "@/components/site/CartView";

export const metadata: Metadata = { title: "Tu pedido" };

export default async function CarritoPage() {
  const settings = await getSettings();
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <span className="eyebrow">Tu pedido</span>
          <h1>Carrito</h1>
        </div>
      </section>
      <CartView settings={settings} />
    </>
  );
}

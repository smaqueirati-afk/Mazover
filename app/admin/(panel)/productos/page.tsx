/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { listAdminProducts } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";

export default async function AdminProductos() {
  const products = await listAdminProducts();
  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Productos</h1>
          <p>{products.length} producto{products.length !== 1 ? "s" : ""} en total.</p>
        </div>
        <Link className="adm-btn adm-btn-primary" href="/admin/productos/nuevo">+ Nuevo producto</Link>
      </div>

      {products.length === 0 ? (
        <div className="adm-notice">Todavía no hay productos. Creá el primero con “Nuevo producto”.</div>
      ) : (
        <table className="adm-table">
          <thead>
            <tr><th></th><th>Nombre</th><th>Precio</th><th>Colores</th><th>Stock</th><th>Estado</th><th></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.cover ? <img className="thumb" src={p.cover} alt="" /> : <div className="thumb" />}</td>
                <td>{p.name}</td>
                <td>{formatPrice(p.price)}</td>
                <td>{p.colors}</td>
                <td>{p.stock > 0 ? p.stock : <span className="adm-pill off">Sin stock</span>}</td>
                <td>
                  {p.is_active ? <span className="adm-pill ok">Activo</span> : <span className="adm-pill off">Inactivo</span>}
                  {p.is_featured && <span className="adm-pill warn" style={{ marginLeft: 6 }}>Destacado</span>}
                </td>
                <td><Link className="adm-btn" href={`/admin/productos/${p.id}`}>Editar</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

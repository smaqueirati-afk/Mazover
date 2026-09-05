"use client";

type Sub = { id: string; email: string; source: string; status: string; created_at: string };

export default function SubscribersView({ rows }: { rows: Sub[] }) {
  const exportCsv = () => {
    const header = "email,source,status,fecha\n";
    const body = rows
      .map((r) => `${r.email},${r.source},${r.status},${new Date(r.created_at).toISOString()}`)
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mazover-suscriptores-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="adm-head">
        <div><h1>Suscriptores</h1><p>{rows.length} {rows.length === 1 ? "email suscripto" : "emails suscriptos"} al newsletter.</p></div>
        {rows.length > 0 && <button className="btn btn-ink" onClick={exportCsv}>Exportar CSV</button>}
      </div>
      {rows.length === 0 ? (
        <div className="adm-notice">Todavía no hay suscriptores. Van a aparecer acá cuando alguien se sume desde el sitio.</div>
      ) : (
        <table className="adm-table">
          <thead><tr><th>Email</th><th>Origen</th><th>Estado</th><th>Fecha</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.email}</td>
                <td><span className="adm-pill">{r.source}</span></td>
                <td><span className={`adm-pill ${r.status === "activo" ? "ok" : "off"}`}>{r.status}</span></td>
                <td>{new Date(r.created_at).toLocaleDateString("es-AR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

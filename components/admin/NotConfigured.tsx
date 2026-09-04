export default function NotConfigured() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#f3f3f0" }}>
      <div className="adm-notice">
        <h2 style={{ fontFamily: "var(--oswald)", textTransform: "uppercase", fontSize: 22, marginBottom: 14, color: "var(--azul-profundo)" }}>
          Conectá Supabase para usar el panel
        </h2>
        <ol style={{ paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
          <li>Creá un proyecto en Supabase.</li>
          <li>Corré <code>supabase/schema.sql</code>, <code>policies.sql</code> y <code>seed.sql</code> en el SQL Editor.</li>
          <li>Copiá <code>.env.example</code> a <code>.env.local</code> y completá <code>NEXT_PUBLIC_SUPABASE_URL</code> y <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.</li>
          <li>Creá un usuario en Authentication y marcá <code>profiles.is_admin = true</code> para ese usuario.</li>
          <li>Reiniciá el servidor (<code>npm run dev</code>) e ingresá en <code>/admin/login</code>.</li>
        </ol>
      </div>
    </div>
  );
}

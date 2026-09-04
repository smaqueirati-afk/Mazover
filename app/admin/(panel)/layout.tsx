import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getSessionUser, getAdminUser } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";
import NotConfigured from "@/components/admin/NotConfigured";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) return <NotConfigured />;

  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const admin = await getAdminUser();
  if (!admin) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f3f3f0" }}>
        <div className="adm-notice">
          <h2 style={{ fontFamily: "var(--oswald)", textTransform: "uppercase", marginBottom: 10 }}>Sin permisos</h2>
          <p>Tu usuario no tiene acceso de administrador. Pedile a un admin que marque <code>profiles.is_admin = true</code> para tu cuenta.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-shell">
      <AdminNav email={admin.profile?.email ?? undefined} />
      <main className="adm-main">{children}</main>
    </div>
  );
}

"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const configured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("TU-PROYECTO");

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push(params.get("next") || "/admin");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  if (!configured) {
    return (
      <div className="adm-msg err" style={{ lineHeight: 1.6 }}>
        Supabase no está configurado. Completá <code>.env.local</code> con las
        credenciales del proyecto para habilitar el login.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      {error && <div className="adm-msg err">{error}</div>}
      <div className="adm-field">
        <label htmlFor="email">Email</label>
        <input id="email" className="adm-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      </div>
      <div className="adm-field">
        <label htmlFor="password">Contraseña</label>
        <input id="password" className="adm-input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
      </div>
      <button className="adm-btn adm-btn-primary" style={{ width: "100%" }} disabled={loading}>
        {loading ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}

export default function AdminLogin() {
  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <div className="logo" style={{ color: "var(--azul-profundo)", justifyContent: "center", marginBottom: 24 }}>
          <span className="logo-badge">MAZOVER</span>
          <span className="logo-txt">
            <span className="logo-word">MAZOVER</span>
            <span className="logo-tag">Panel de administración</span>
          </span>
        </div>
        <Suspense fallback={<div className="adm-msg">Cargando…</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

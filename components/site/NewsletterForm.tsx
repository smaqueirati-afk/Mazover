"use client";

import { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/lib/newsletter.actions";

export default function NewsletterForm({
  placeholder = "Ingresá tu email",
  button = "Suscribirse",
  source = "newsletter",
  variant = "band",
}: {
  placeholder?: string;
  button?: string;
  source?: string;
  variant?: "band" | "footer";
}) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      const res = await subscribeNewsletter({ email, source });
      setMsg({ ok: res.ok, text: res.message });
      if (res.ok) setEmail("");
    });
  };

  return (
    <div className={`nl-wrap nl-${variant}`}>
      <form className="nl-form" onSubmit={submit}>
        <span className="nl-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          aria-label="Email"
          required
        />
        <button type="submit" disabled={pending}>{pending ? "Enviando…" : button}</button>
      </form>
      {msg && <p className={`nl-msg ${msg.ok ? "ok" : "err"}`} role="status">{msg.text}</p>}
    </div>
  );
}

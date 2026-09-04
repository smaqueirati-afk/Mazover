import type { Settings } from "@/lib/types";

export default function WhatsappFab({ settings }: { settings: Settings }) {
  const phone = (settings.whatsapp_number ?? "").replace(/\D/g, "");
  if (!phone) return null;
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(
    settings.whatsapp_message ?? "Hola, quiero consultar por los jeans."
  )}`;
  return (
    <a className="wa" href={href} target="_blank" rel="noopener noreferrer" aria-label="Consultar por WhatsApp">
      <svg viewBox="0 0 24 24">
        <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.9 9.9 0 0 0 4.73 1.2h.01c5.46 0 9.9-4.44 9.9-9.9S17.5 2 12.04 2zm5.8 14.16c-.24.68-1.42 1.32-1.95 1.36-.5.05-.5.4-3.16-.66-2.66-1.06-4.32-3.8-4.45-3.98-.13-.18-1.06-1.4-1.06-2.67s.66-1.9.9-2.16c.24-.26.53-.32.7-.32.18 0 .35 0 .5.01.16.01.38-.06.6.46.24.56.8 1.94.87 2.08.07.14.12.3.02.48-.1.18-.15.3-.29.46-.14.16-.3.36-.43.48-.14.14-.29.29-.12.57.16.28.73 1.2 1.57 1.95 1.08.96 1.98 1.26 2.26 1.4.28.14.44.12.6-.07.16-.18.7-.8.88-1.08.18-.28.36-.24.6-.14.24.1 1.55.73 1.82.86.28.14.46.2.53.32.07.12.07.68-.17 1.36z" />
      </svg>
    </a>
  );
}

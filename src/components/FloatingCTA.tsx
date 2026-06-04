"use client";

import { useState } from "react";
import { X } from "lucide-react";

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default function FloatingCTA() {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-2">

      {/* Tarjeta expandida */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: expanded ? "200px" : "0px",
          opacity: expanded ? 1 : 0,
          transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-64 mb-1">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-bold text-[#C9A84C] uppercase tracking-wider">Para ocasiones especiales</p>
            <button onClick={() => setExpanded(false)} className="text-gray-300 hover:text-gray-500 transition-colors -mt-0.5 -mr-1">
              <X size={14} />
            </button>
          </div>
          <p className="text-sm font-semibold text-[#2C1810] mb-1">¿Quieres algo hecho para ti?</p>
          <p className="text-xs text-[#2C1810]/60 leading-relaxed mb-3">
            Bodas, XV años, regalos corporativos o simplemente algo único. Velas con tus colores y tu aroma.
          </p>
          <a
            href="https://wa.me/5215563442525?text=Hola!%20Quisiera%20un%20pedido%20personalizado"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setExpanded(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#22c55e] transition-colors"
          >
            <WhatsAppIcon /> Cotizar ahora
          </a>
        </div>
      </div>

      {/* Botón flotante */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2.5 bg-[#25D366] text-white pl-4 pr-5 py-3 rounded-full shadow-xl hover:bg-[#22c55e] transition-all duration-200 hover:shadow-2xl"
        style={{ transform: expanded ? "scale(0.97)" : "scale(1)" }}
      >
        <WhatsAppIcon />
        <span className="text-sm font-semibold hidden sm:block">Pedido personalizado</span>
      </button>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const STATUSES = [
  { value: "pendiente",  label: "Pendiente",   color: "bg-yellow-50 text-yellow-600" },
  { value: "pagado",     label: "Pagado",      color: "bg-blue-50 text-blue-600" },
  { value: "en_proceso", label: "En proceso",  color: "bg-purple-50 text-purple-600" },
  { value: "enviado",    label: "Enviado",     color: "bg-indigo-50 text-indigo-600" },
  { value: "entregado",  label: "Entregado",   color: "bg-green-50 text-green-600" },
  { value: "cancelado",  label: "Cancelado",   color: "bg-red-50 text-red-500" },
];

export default function OrderStatusBadge({ status, orderId }: { status: string; orderId: string }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(status);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const s = STATUSES.find((s) => s.value === current) ?? STATUSES[0];

  const handleToggle = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.left + rect.width / 2 });
    }
    setOpen((o) => !o);
  };

  const handleChange = async (newStatus: string) => {
    setOpen(false);
    setCurrent(newStatus);
    const supabase = createClient();
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    router.refresh();
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${s.color}`}
      >
        {s.label} ▾
      </button>

      {open && mounted && createPortal(
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="fixed z-50 -translate-x-1/2 bg-white rounded-xl border border-gray-100 shadow-lg py-1 min-w-[130px]"
            style={{ top: menuPos.top, left: menuPos.left }}
          >
            {STATUSES.map((st) => (
              <button
                key={st.value}
                onClick={() => handleChange(st.value)}
                className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-gray-50 transition-colors ${st.value === current ? "text-[#C9A84C]" : "text-gray-700"}`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

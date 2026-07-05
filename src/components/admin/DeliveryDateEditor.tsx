"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Check, X } from "lucide-react";

export default function DeliveryDateEditor({ orderId, deliveryDate }: { orderId: string; deliveryDate: string | null }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(deliveryDate ?? "");
  const [saved, setSaved] = useState(deliveryDate);
  const [saving, setSaving] = useState(false);

  const fmt = (d: string) =>
    new Date(d + "T12:00:00").toLocaleDateString("es-MX", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("orders").update({ delivery_date: value || null }).eq("id", orderId);
    setSaved(value || null);
    setSaving(false);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1.5 mt-1">
        <input
          type="date"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-[#C9A84C] bg-white"
          autoFocus
        />
        <button onClick={handleSave} disabled={saving} className="p-1 rounded-lg text-green-500 hover:bg-green-50">
          <Check size={13} />
        </button>
        <button onClick={() => { setEditing(false); setValue(saved ?? ""); }} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
          <X size={13} />
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => setEditing(true)} className="flex items-center gap-1 mt-1 group text-left">
      <span className={`text-xs ${saved ? "text-[#C9A84C] font-medium" : "text-gray-300"}`}>
        {saved ? `Entrega: ${fmt(saved)}` : "Agregar fecha de entrega"}
      </span>
      <Pencil size={10} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

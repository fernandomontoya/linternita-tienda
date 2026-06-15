"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Plus, Trash2, Palette } from "lucide-react";

interface ColorItem {
  id: string;
  label: string;
  hex: string;
  sort_order: number;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ColorCatalogClient({
  table,
  title,
  description,
  initialColors,
}: {
  table: "ribbon_colors" | "card_colors";
  title: string;
  description: string;
  initialColors: ColorItem[];
}) {
  const [colors, setColors] = useState<ColorItem[]>(initialColors);
  const [newLabel, setNewLabel] = useState("");
  const [newHex, setNewHex] = useState("#C9A84C");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const label = newLabel.trim();
    if (!label) return;
    const id = slugify(label);
    if (colors.some((c) => c.id === id)) {
      setError("Ya existe un color con ese nombre.");
      return;
    }
    setError("");
    setAdding(true);
    const supabase = createClient();
    const sort_order = (colors[colors.length - 1]?.sort_order ?? 0) + 1;
    const { data, error: err } = await supabase
      .from(table)
      .insert({ id, label, hex: newHex, sort_order })
      .select()
      .single();
    if (err || !data) {
      setError(err?.message ?? "Error al agregar");
    } else {
      setColors((prev) => [...prev, data]);
      setNewLabel("");
      setNewHex("#C9A84C");
    }
    setAdding(false);
  };

  const handleDelete = async (color: ColorItem) => {
    const confirmed = confirm(`¿Eliminar el color "${color.label}"?`);
    if (!confirmed) return;
    setDeletingId(color.id);
    const supabase = createClient();
    const { error: err } = await supabase.from(table).delete().eq("id", color.id);
    if (err) {
      alert("Error al eliminar: " + err.message);
    } else {
      setColors((prev) => prev.filter((c) => c.id !== color.id));
    }
    setDeletingId(null);
  };

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#E8C97A]/20 flex items-center justify-center">
          <Palette size={20} className="text-[#C9A84C]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        {colors.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No hay colores aún</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {colors.map((color) => (
              <li key={color.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                <span
                  className="w-7 h-7 rounded-full border border-gray-200 shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm">{color.label}</p>
                  <p className="text-xs text-gray-400 font-mono">{color.hex}</p>
                </div>
                <button
                  onClick={() => handleDelete(color)}
                  disabled={deletingId === color.id}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 opacity-0 group-hover:opacity-100"
                  title="Eliminar"
                >
                  {deletingId === color.id
                    ? <Loader2 size={15} className="animate-spin" />
                    : <Trash2 size={15} />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Agregar color</h2>
        <div className="flex gap-2">
          <input
            type="color"
            value={newHex}
            onChange={(e) => setNewHex(e.target.value)}
            className="w-12 h-[42px] rounded-xl border border-gray-200 cursor-pointer"
          />
          <input
            value={newLabel}
            onChange={(e) => { setNewLabel(e.target.value); setError(""); }}
            placeholder='Ej. "Rosa palo"'
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10"
          />
          <button
            type="submit"
            disabled={adding || !newLabel.trim()}
            className="bg-[#C9A84C] hover:bg-[#B8973B] text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40"
          >
            {adding ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            Agregar
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}

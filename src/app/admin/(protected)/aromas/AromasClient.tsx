"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Plus, Trash2, GripVertical, Sparkles } from "lucide-react";

interface Aroma {
  id: string;
  label: string;
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

export default function AromasClient({ initialAromas }: { initialAromas: Aroma[] }) {
  const [aromas, setAromas] = useState<Aroma[]>(initialAromas);
  const [newLabel, setNewLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const label = newLabel.trim();
    if (!label) return;
    const id = slugify(label);
    if (aromas.some((a) => a.id === id)) {
      setError("Ya existe un aroma con ese nombre.");
      return;
    }
    setError("");
    setAdding(true);
    const supabase = createClient();
    const sort_order = (aromas[aromas.length - 1]?.sort_order ?? 0) + 1;
    const { data, error: err } = await supabase
      .from("aromas")
      .insert({ id, label, sort_order })
      .select()
      .single();
    if (err || !data) {
      setError(err?.message ?? "Error al agregar");
    } else {
      setAromas((prev) => [...prev, data]);
      setNewLabel("");
    }
    setAdding(false);
  };

  const handleDelete = async (aroma: Aroma) => {
    const confirmed = confirm(`¿Eliminar el aroma "${aroma.label}"? Seguirá apareciendo en productos que ya lo tengan asignado, pero no podrás volver a seleccionarlo para nuevos.`);
    if (!confirmed) return;
    setDeletingId(aroma.id);
    const supabase = createClient();
    const { error: err } = await supabase.from("aromas").delete().eq("id", aroma.id);
    if (err) {
      alert("Error al eliminar: " + err.message);
    } else {
      setAromas((prev) => prev.filter((a) => a.id !== aroma.id));
    }
    setDeletingId(null);
  };

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#E8C97A]/20 flex items-center justify-center">
          <Sparkles size={20} className="text-[#C9A84C]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aromas</h1>
          <p className="text-sm text-gray-500">Catálogo de aromas para asignar a tus productos</p>
        </div>
      </div>

      {/* Lista de aromas */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        {aromas.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No hay aromas aún</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {aromas.map((aroma) => (
              <li key={aroma.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                <GripVertical size={16} className="text-gray-300 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm">{aroma.label}</p>
                  <p className="text-xs text-gray-400 font-mono">{aroma.id}</p>
                </div>
                <button
                  onClick={() => handleDelete(aroma)}
                  disabled={deletingId === aroma.id}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 opacity-0 group-hover:opacity-100"
                  title="Eliminar"
                >
                  {deletingId === aroma.id
                    ? <Loader2 size={15} className="animate-spin" />
                    : <Trash2 size={15} />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Agregar nuevo */}
      <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Agregar aroma</h2>
        <div className="flex gap-2">
          <input
            value={newLabel}
            onChange={(e) => { setNewLabel(e.target.value); setError(""); }}
            placeholder='Ej. "Lavanda con vainilla"'
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

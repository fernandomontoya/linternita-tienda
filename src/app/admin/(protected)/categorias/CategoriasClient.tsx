"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Plus, Trash2, GripVertical, Tag } from "lucide-react";

interface Category {
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

export default function CategoriasClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newLabel, setNewLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const label = newLabel.trim();
    if (!label) return;
    const id = slugify(label);
    if (categories.some((c) => c.id === id)) {
      setError("Ya existe una categoría con ese nombre.");
      return;
    }
    setError("");
    setAdding(true);
    const supabase = createClient();
    const sort_order = (categories[categories.length - 1]?.sort_order ?? 0) + 1;
    const { data, error: err } = await supabase
      .from("categories")
      .insert({ id, label, sort_order })
      .select()
      .single();
    if (err || !data) {
      setError(err?.message ?? "Error al agregar");
    } else {
      setCategories((prev) => [...prev, data]);
      setNewLabel("");
    }
    setAdding(false);
  };

  const handleDelete = async (cat: Category) => {
    const confirmed = confirm(`¿Eliminar la categoría "${cat.label}"? Los productos con esta categoría quedarán sin categoría asignada.`);
    if (!confirmed) return;
    setDeletingId(cat.id);
    const supabase = createClient();
    const { error: err } = await supabase.from("categories").delete().eq("id", cat.id);
    if (err) {
      alert("Error al eliminar: " + err.message);
    } else {
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    }
    setDeletingId(null);
  };

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#E8C97A]/20 flex items-center justify-center">
          <Tag size={20} className="text-[#C9A84C]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <p className="text-sm text-gray-500">Administra las categorías de los productos</p>
        </div>
      </div>

      {/* Lista de categorías */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No hay categorías aún</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                <GripVertical size={16} className="text-gray-300 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm">{cat.label}</p>
                  <p className="text-xs text-gray-400 font-mono">{cat.id}</p>
                </div>
                <button
                  onClick={() => handleDelete(cat)}
                  disabled={deletingId === cat.id}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 opacity-0 group-hover:opacity-100"
                  title="Eliminar"
                >
                  {deletingId === cat.id
                    ? <Loader2 size={15} className="animate-spin" />
                    : <Trash2 size={15} />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Agregar nueva */}
      <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Agregar categoría</h2>
        <div className="flex gap-2">
          <input
            value={newLabel}
            onChange={(e) => { setNewLabel(e.target.value); setError(""); }}
            placeholder='Ej. "Geódicas" o "San Valentín"'
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
        {newLabel.trim() && (
          <p className="text-xs text-gray-400 mt-2">
            ID que se guardará: <span className="font-mono text-gray-500">{slugify(newLabel)}</span>
          </p>
        )}
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}

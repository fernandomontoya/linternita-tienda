"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Plus, X } from "lucide-react";

interface Size { id: string; name: string; priceModifier: number; }

interface ProductFormData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  aromas: string[];
  sizes: Size[];
  featured: boolean;
  stock: number;
  active: boolean;
}

const CATEGORIES = ["aromaticas", "decorativas", "relajacion", "regalo", "navidad"];

export default function ProductForm({ initialData }: { initialData?: Partial<ProductFormData> }) {
  const router = useRouter();
  const isEditing = !!initialData?.id;

  const [form, setForm] = useState<ProductFormData>({
    id: initialData?.id ?? "",
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    price: initialData?.price ?? 0,
    category: initialData?.category ?? "aromaticas",
    image_url: initialData?.image_url ?? "",
    aromas: initialData?.aromas ?? [],
    sizes: initialData?.sizes ?? [],
    featured: initialData?.featured ?? false,
    stock: initialData?.stock ?? 0,
    active: initialData?.active ?? true,
  });
  const [newAroma, setNewAroma] = useState("");
  const [newSize, setNewSize] = useState({ id: "", name: "", priceModifier: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const slugify = (text: string) =>
    text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const payload = {
      ...form,
      id: isEditing ? form.id : slugify(form.name),
      sizes: form.sizes.length > 0 ? form.sizes : null,
      aromas: form.aromas.length > 0 ? form.aromas : null,
      image_url: form.image_url || null,
    };

    const { error: dbError } = isEditing
      ? await supabase.from("products").update(payload).eq("id", form.id)
      : await supabase.from("products").insert(payload);

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }
    router.push("/admin/productos");
    router.refresh();
  };

  const addAroma = () => {
    if (newAroma.trim() && !form.aromas.includes(newAroma.trim())) {
      setForm((f) => ({ ...f, aromas: [...f.aromas, newAroma.trim()] }));
      setNewAroma("");
    }
  };

  const addSize = () => {
    if (newSize.name.trim()) {
      const sizeToAdd = { ...newSize, id: slugify(newSize.name) };
      setForm((f) => ({ ...f, sizes: [...f.sizes, sizeToAdd] }));
      setNewSize({ id: "", name: "", priceModifier: 0 });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Columna izquierda */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-900">Información básica</h2>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Nombre del producto *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Vela de Lavanda"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Descripción</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Descripción del producto..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Precio base (MXN) *</label>
                <input
                  required
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Stock *</label>
                <input
                  required
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Categoría</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">URL de imagen</label>
              <input
                type="url"
                value={form.image_url}
                onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                placeholder="https://... (opcional)"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]"
              />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="w-4 h-4 accent-[#C9A84C]"
                />
                <span className="text-sm text-gray-700">Producto destacado</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  className="w-4 h-4 accent-[#C9A84C]"
                />
                <span className="text-sm text-gray-700">Activo (visible)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-5">
          {/* Aromas */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Aromas disponibles</h2>
            <div className="flex gap-2 mb-3">
              <input
                value={newAroma}
                onChange={(e) => setNewAroma(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAroma())}
                placeholder="Ej: Lavanda con vainilla"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
              />
              <button type="button" onClick={addAroma} className="btn-gold px-3 py-2 rounded-xl">
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.aromas.map((aroma) => (
                <span key={aroma} className="flex items-center gap-1 bg-[#F9F0E6] text-[#8B6914] text-xs px-3 py-1 rounded-full">
                  {aroma}
                  <button type="button" onClick={() => setForm((f) => ({ ...f, aromas: f.aromas.filter((a) => a !== aroma) }))}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              {form.aromas.length === 0 && <p className="text-xs text-gray-400">Sin aromas</p>}
            </div>
          </div>

          {/* Tamaños */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Tamaños / variantes</h2>
            <div className="grid grid-cols-[1fr_auto_80px] gap-2 mb-3">
              <input
                value={newSize.name}
                onChange={(e) => setNewSize((s) => ({ ...s, name: e.target.value }))}
                placeholder="Ej: Grande (350g)"
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
              />
              <input
                type="number"
                value={newSize.priceModifier}
                onChange={(e) => setNewSize((s) => ({ ...s, priceModifier: Number(e.target.value) }))}
                placeholder="+$"
                className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
              />
              <button type="button" onClick={addSize} className="btn-gold px-3 py-2 rounded-xl flex items-center justify-center">
                <Plus size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-3">Precio adicional sobre el precio base (0 si es el mismo precio)</p>
            <div className="space-y-2">
              {form.sizes.map((size) => (
                <div key={size.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                  <span className="text-sm text-gray-700">{size.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#C9A84C] font-semibold">
                      {size.priceModifier > 0 ? `+$${size.priceModifier}` : "Precio base"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, sizes: f.sizes.filter((s) => s.id !== size.id) }))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {form.sizes.length === 0 && <p className="text-xs text-gray-400">Sin variantes de tamaño</p>}
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-gold px-8 py-2.5 rounded-xl flex items-center gap-2 text-sm disabled:opacity-60"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Guardando...</> : isEditing ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}

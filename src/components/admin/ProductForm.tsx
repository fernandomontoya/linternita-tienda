"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Plus, X, Upload, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Size { id: string; name: string; priceModifier: number; isPackage?: boolean; }

interface ProductFormData {
  id: string;
  name: string;
  description: string;
  price: number;
  price_promo: number | null;
  category: string;
  images: string[];
  aromas: string[];
  sizes: Size[];
  featured: boolean;
  stock: number;
  active: boolean;
  width_cm: number | null;
  height_cm: number | null;
  molds: number | null;
}

export default function ProductForm({
  initialData,
  categories = [],
  aromaCatalog = [],
}: {
  initialData?: Partial<ProductFormData & { image_url?: string }>;
  categories?: { id: string; label: string }[];
  aromaCatalog?: { id: string; label: string }[];
}) {
  const router = useRouter();
  const isEditing = !!initialData?.id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Combinar image_url legacy + images array
  const initialImages = (() => {
    const imgs = initialData?.images ?? [];
    if (initialData?.image_url && !imgs.includes(initialData.image_url)) {
      return [initialData.image_url, ...imgs];
    }
    return imgs;
  })();

  const [form, setForm] = useState<ProductFormData>({
    id: initialData?.id ?? "",
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    price: initialData?.price ?? 0,
    price_promo: (initialData as Partial<ProductFormData & { price_promo?: number | null }>)?.price_promo ?? null,
    category: initialData?.category ?? "aromaticas",
    images: initialImages,
    aromas: initialData?.aromas ?? [],
    sizes: initialData?.sizes ?? [],
    featured: initialData?.featured ?? false,
    stock: initialData?.stock ?? 0,
    active: initialData?.active ?? true,
    width_cm: (initialData as Partial<ProductFormData & { width_cm?: number | null }>)?.width_cm ?? null,
    height_cm: (initialData as Partial<ProductFormData & { height_cm?: number | null }>)?.height_cm ?? null,
    molds: (initialData as Partial<ProductFormData & { molds?: number | null }>)?.molds ?? null,
  });

  const [newSize, setNewSize] = useState<Size & { id: string }>({ id: "", name: "", priceModifier: 0, isPackage: false });
  const [loading, setLoading] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [error, setError] = useState("");

  const slugify = (text: string) =>
    text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleImagesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const invalid = files.find((f) => !f.type.startsWith("image/") || f.size > 5 * 1024 * 1024);
    if (invalid) { setError("Solo imágenes JPG/PNG/WEBP de máx 5MB"); return; }

    setError("");
    setUploadingCount(files.length);

    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("products").upload(fileName, file);
      if (uploadError) { setError("Error al subir una imagen"); continue; }
      const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(fileName);
      uploaded.push(publicUrl);
      setUploadingCount((c) => c - 1);
    }

    setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }));
    setUploadingCount(0);
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (url: string) =>
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }));

  const moveImage = (from: number, to: number) => {
    const imgs = [...form.images];
    const [moved] = imgs.splice(from, 1);
    imgs.splice(to, 0, moved);
    setForm((f) => ({ ...f, images: imgs }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const payload = {
      ...form,
      id: isEditing ? form.id : slugify(form.name),
      image_url: form.images[0] ?? null,
      images: form.images.length > 0 ? form.images : null,
      sizes: form.sizes.length > 0 ? form.sizes : null,
      aromas: form.aromas.length > 0 ? form.aromas : null,
    };
    const { error: dbError } = isEditing
      ? await supabase.from("products").update(payload).eq("id", form.id)
      : await supabase.from("products").insert(payload);
    if (dbError) { setError(dbError.message); setLoading(false); return; }
    router.push("/admin/productos");
    router.refresh();
  };

  const toggleAroma = (label: string) => {
    setForm((f) => ({
      ...f,
      aromas: f.aromas.includes(label)
        ? f.aromas.filter((a) => a !== label)
        : [...f.aromas, label],
    }));
  };

  const addSize = () => {
    if (newSize.name.trim()) {
      setForm((f) => ({ ...f, sizes: [...f.sizes, { ...newSize, id: slugify(newSize.name) }] }));
      setNewSize({ id: "", name: "", priceModifier: 0, isPackage: false });
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
              <label className="text-xs font-medium text-gray-600 block mb-1">Nombre *</label>
              <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Vela de Lavanda"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Descripción</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Descripción del producto..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Precio (MXN) *</label>
                <input required type="number" min={0} value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Stock *</label>
                <input required type="number" min={0} value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Moldes <span className="text-gray-400 font-normal">— opcional</span>
                </label>
                <input type="number" min={0} value={form.molds ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, molds: e.target.value === "" ? null : Number(e.target.value) }))}
                  placeholder="Ej. 3"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Ancho (cm) <span className="text-gray-400 font-normal">— opcional</span>
                </label>
                <input type="number" min={0} step="0.1" value={form.width_cm ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, width_cm: e.target.value === "" ? null : Number(e.target.value) }))}
                  placeholder="Ej. 8"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Alto (cm) <span className="text-gray-400 font-normal">— opcional</span>
                </label>
                <input type="number" min={0} step="0.1" value={form.height_cm ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, height_cm: e.target.value === "" ? null : Number(e.target.value) }))}
                  placeholder="Ej. 12"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">
                Precio promoción (MXN){" "}
                <span className="text-gray-400 font-normal">— opcional, deja vacío si no hay oferta</span>
              </label>
              <div className="relative">
                <input
                  type="number" min={0}
                  value={form.price_promo ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, price_promo: e.target.value === "" ? null : Number(e.target.value) }))}
                  placeholder="Ej. 220"
                  className="w-full border border-[#E8C97A] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] bg-[#FFFBF2]"
                />
                {form.price_promo && form.price_promo < form.price && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                    -{Math.round((1 - form.price_promo / form.price) * 100)}% desc.
                  </span>
                )}
              </div>
              {form.price_promo !== null && form.price_promo >= form.price && (
                <p className="text-xs text-amber-600 mt-1">⚠️ El precio de promoción debe ser menor al precio normal</p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Categoría</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] bg-white">
                {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-[#C9A84C]" />
                <span className="text-sm text-gray-700">Destacado</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-[#C9A84C]" />
                <span className="text-sm text-gray-700">Activo</span>
              </label>
            </div>
          </div>

          {/* Imágenes */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Imágenes</h2>
              <span className="text-xs text-gray-400">{form.images.length} foto{form.images.length !== 1 ? "s" : ""} · La primera es la principal</span>
            </div>

            {/* Grid de imágenes */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {form.images.map((url, i) => (
                <div key={url} className="relative group aspect-square rounded-xl overflow-hidden bg-[#F9F0E6]">
                  <Image src={url} alt={`Imagen ${i + 1}`} fill className="object-cover" unoptimized />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-[#C9A84C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">Principal</span>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    {i > 0 && (
                      <button type="button" onClick={() => moveImage(i, i - 1)}
                        className="bg-white text-gray-700 text-xs px-2 py-1 rounded-lg font-medium hover:bg-gray-100">
                        ← Mover
                      </button>
                    )}
                    <button type="button" onClick={() => removeImage(url)}
                      className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Botón agregar */}
              <button type="button" onClick={() => fileInputRef.current?.click()}
                disabled={uploadingCount > 0}
                className="aspect-square rounded-xl border-2 border-dashed border-[#E8C97A] bg-[#FAF7F2] hover:bg-[#F9F0E6] transition-colors flex flex-col items-center justify-center gap-1 text-[#8B6914]/60 hover:text-[#8B6914] disabled:opacity-50">
                {uploadingCount > 0
                  ? <><Loader2 size={20} className="animate-spin" /><span className="text-[10px]">Subiendo {uploadingCount}...</span></>
                  : <><Upload size={20} /><span className="text-[10px] font-medium">Agregar</span></>
                }
              </button>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImagesSelect} className="hidden" />
            <p className="text-[10px] text-gray-400">JPG, PNG, WEBP · máx 5MB por imagen · puedes seleccionar varias a la vez</p>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-5">
          {/* Aromas */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-gray-900">Aromas disponibles</h2>
              <Link href="/admin/aromas" className="text-xs text-[#C9A84C] hover:underline font-medium">
                Gestionar catálogo
              </Link>
            </div>
            <p className="text-xs text-gray-400 mb-3">Selecciona los aromas que aplican a este producto.</p>
            {aromaCatalog.length === 0 ? (
              <p className="text-xs text-gray-400">
                No hay aromas en el catálogo.{" "}
                <Link href="/admin/aromas" className="text-[#C9A84C] hover:underline font-medium">Agrega algunos aquí</Link>.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {aromaCatalog.map((aroma) => {
                  const active = form.aromas.includes(aroma.label);
                  return (
                    <button
                      key={aroma.id}
                      type="button"
                      onClick={() => toggleAroma(aroma.label)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        active
                          ? "bg-[#C9A84C] text-white border-[#C9A84C]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#C9A84C]"
                      }`}
                    >
                      {aroma.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tamaños */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Tamaños / variantes</h2>
            <div className="grid grid-cols-[1fr_100px_40px] gap-2 mb-2">
              <input value={newSize.name} onChange={(e) => setNewSize((s) => ({ ...s, name: e.target.value }))}
                placeholder="Ej: Grande (350g)"
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" />
              <input type="number" value={newSize.priceModifier} onChange={(e) => setNewSize((s) => ({ ...s, priceModifier: Number(e.target.value) }))}
                placeholder={newSize.isPackage ? "Precio total" : "+$"}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" />
              <button type="button" onClick={addSize} className="btn-gold px-2 py-2 rounded-xl flex items-center justify-center"><Plus size={16} /></button>
            </div>
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input type="checkbox" checked={!!newSize.isPackage}
                onChange={(e) => setNewSize((s) => ({ ...s, isPackage: e.target.checked }))}
                className="w-4 h-4 accent-[#C9A84C]" />
              <span className="text-xs text-gray-600">Es un kit/paquete (el precio de arriba es el precio total, no un adicional)</span>
            </label>
            <p className="text-xs text-gray-400 mb-3">
              {newSize.isPackage
                ? "El precio que pongas será el precio FINAL de este kit, sin importar el precio base."
                : "Precio adicional sobre el precio base (0 = precio base)."}
            </p>
            <div className="space-y-2">
              {form.sizes.map((size) => (
                <div key={size.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                  <span className="text-sm text-gray-700">
                    {size.name} {size.isPackage && <span className="text-[10px] uppercase tracking-wide text-[#C9A84C] font-semibold ml-1">Kit</span>}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#C9A84C] font-semibold">
                      {size.isPackage
                        ? `$${size.priceModifier} (total)`
                        : size.priceModifier > 0 ? `+$${size.priceModifier}` : "Precio base"}
                    </span>
                    <button type="button" onClick={() => setForm((f) => ({ ...f, sizes: f.sizes.filter((s) => s.id !== size.id) }))} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                  </div>
                </div>
              ))}
              {form.sizes.length === 0 && <p className="text-xs text-gray-400">Sin variantes</p>}
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-xl">{error}</p>}

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors">Cancelar</button>
        <button type="submit" disabled={loading || uploadingCount > 0} className="btn-gold px-8 py-2.5 rounded-xl flex items-center gap-2 text-sm disabled:opacity-60">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Guardando...</> : isEditing ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}

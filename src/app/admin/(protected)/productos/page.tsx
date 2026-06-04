import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { categories } from "@/data/products";

export default async function AdminProductosPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const getCategoryLabel = (id: string) =>
    categories.find((c) => c.id === id)?.label ?? id;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-400 mt-0.5">{products?.length ?? 0} en total</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="btn-gold px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold"
        >
          <Plus size={15} /> Nuevo producto
        </Link>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Producto</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Categoría</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Precio</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Estado</th>
                <th className="px-4 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products?.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">

                  {/* Producto */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F9F0E6] flex-shrink-0 overflow-hidden">
                        {p.images?.[0] || p.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.images?.[0] || p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-sm">🕯️</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium text-gray-900">{p.name}</p>
                          {p.featured && <span className="text-amber-400 text-xs" title="Destacado">★</span>}
                          {!p.active && <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-md">Oculto</span>}
                        </div>
                        <p className="text-xs text-gray-400 truncate max-w-[200px] hidden sm:block">{p.description}</p>
                      </div>
                    </div>
                  </td>

                  {/* Categoría */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs font-medium text-[#8B6914] bg-[#F9F0E6] px-2.5 py-1 rounded-full">
                      {getCategoryLabel(p.category)}
                    </span>
                  </td>

                  {/* Precio */}
                  <td className="px-4 py-3 text-right">
                    <p className="text-sm font-semibold text-gray-800 tabular-nums">
                      ${Number(p.price).toLocaleString("es-MX")}
                    </p>
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      p.stock === 0 ? "bg-red-50 text-red-500" :
                      p.stock <= 5 ? "bg-orange-50 text-orange-500" :
                      "bg-green-50 text-green-600"
                    }`}>
                      {p.stock === 0 ? "Agotado" : p.stock}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${p.active ? "bg-green-400" : "bg-gray-300"}`} title={p.active ? "Activo" : "Inactivo"} />
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/admin/productos/${p.id}`}
                        className="p-1.5 text-gray-400 hover:text-[#C9A84C] hover:bg-[#F9F0E6] rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </Link>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products?.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🕯️</p>
            <p className="text-sm font-medium text-gray-600">Sin productos todavía</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">Crea tu primer producto para empezar</p>
            <Link href="/admin/productos/nuevo" className="btn-gold px-5 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
              <Plus size={14} /> Crear producto
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

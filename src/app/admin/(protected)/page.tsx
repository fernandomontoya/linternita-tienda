import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Package, TrendingUp, AlertTriangle, Plus } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select("*");

  const total = products?.length ?? 0;
  const featured = products?.filter((p) => p.featured).length ?? 0;
  const lowStock = products?.filter((p) => p.stock <= 5 && p.stock > 0).length ?? 0;
  const outOfStock = products?.filter((p) => p.stock === 0).length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Resumen de tu tienda</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="btn-gold px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Nuevo producto
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Package, label: "Total productos", value: total, color: "blue" },
          { icon: TrendingUp, label: "Destacados", value: featured, color: "yellow" },
          { icon: AlertTriangle, label: "Stock bajo", value: lowStock, color: "orange" },
          { icon: AlertTriangle, label: "Agotados", value: outOfStock, color: "red" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
              color === "blue" ? "bg-blue-100 text-blue-600" :
              color === "yellow" ? "bg-yellow-100 text-yellow-600" :
              color === "orange" ? "bg-orange-100 text-orange-600" :
              "bg-red-100 text-red-500"
            }`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Productos recientes</h2>
          <Link href="/admin/productos" className="text-sm text-[#C9A84C] hover:underline">
            Ver todos
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {products?.slice(0, 6).map((p) => (
            <div key={p.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-400">{p.category}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#C9A84C]">
                  ${Number(p.price).toLocaleString("es-MX")}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  p.stock === 0 ? "bg-red-100 text-red-600" :
                  p.stock <= 5 ? "bg-orange-100 text-orange-600" :
                  "bg-green-100 text-green-600"
                }`}>
                  {p.stock === 0 ? "Agotado" : `${p.stock} pzas`}
                </span>
                <Link href={`/admin/productos/${p.id}`} className="text-xs text-[#C9A84C] hover:underline">
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

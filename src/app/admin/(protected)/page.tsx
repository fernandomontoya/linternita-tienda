import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Package, Star, AlertTriangle, XCircle, Plus, ArrowRight, Pencil, ShoppingBag } from "lucide-react";
import { categories } from "@/data/products";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: orders } = await supabase.from("orders").select("id, status, total");
  const pendingOrders = orders?.filter((o) => o.status === "pendiente").length ?? 0;
  const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0;

  const total = products?.length ?? 0;
  const featured = products?.filter((p) => p.featured).length ?? 0;
  const lowStock = products?.filter((p) => p.stock <= 5 && p.stock > 0).length ?? 0;
  const outOfStock = products?.filter((p) => p.stock === 0).length ?? 0;

  const stats = [
    { icon: ShoppingBag, label: "Pedidos nuevos", value: pendingOrders, sub: "por atender", bg: "bg-[#F9F0E6]", color: "text-[#C9A84C]", href: "/admin/pedidos" },
    { icon: Package, label: "Productos", value: total, sub: "en catálogo", bg: "bg-blue-50", color: "text-blue-600", href: "/admin/productos" },
    { icon: AlertTriangle, label: "Stock bajo", value: lowStock, sub: "≤ 5 piezas", bg: "bg-orange-50", color: "text-orange-500" },
    { icon: XCircle, label: "Agotados", value: outOfStock, sub: "sin stock", bg: "bg-red-50", color: "text-red-500" },
  ];

  const getCategoryLabel = (id: string) =>
    categories.find((c) => c.id === id)?.label ?? id;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Bienvenida de nuevo</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="btn-gold px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold"
        >
          <Plus size={15} /> Nuevo producto
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(({ icon: Icon, label, value, sub, bg, color, href }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`inline-flex w-9 h-9 rounded-xl items-center justify-center mb-3 ${bg} ${color}`}>
              <Icon size={16} />
            </div>
            <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
            <p className="text-xs font-medium text-gray-600 mt-1">{label}</p>
            <p className="text-[11px] text-gray-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Tabla recientes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">Productos recientes</h2>
          <Link href="/admin/productos" className="text-xs text-[#C9A84C] hover:underline flex items-center gap-1">
            Ver todos <ArrowRight size={11} />
          </Link>
        </div>

        <div className="divide-y divide-gray-50">
          {products?.slice(0, 8).map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/50 transition-colors group">

              {/* Imagen miniatura */}
              <div className="w-9 h-9 rounded-xl bg-[#F9F0E6] flex-shrink-0 overflow-hidden">
                {p.images?.[0] || p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images?.[0] || p.image_url} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-base">🕯️</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                  {p.featured && <span className="text-amber-400 text-xs">★</span>}
                </div>
                <p className="text-[11px] text-gray-400">
                  {getCategoryLabel(p.category)}
                </p>
              </div>

              {/* Precio */}
              <p className="text-sm font-semibold text-gray-700 tabular-nums">
                ${Number(p.price).toLocaleString("es-MX")}
              </p>

              {/* Stock badge */}
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold hidden sm:inline-flex ${
                p.stock === 0 ? "bg-red-50 text-red-500" :
                p.stock <= 5 ? "bg-orange-50 text-orange-500" :
                "bg-green-50 text-green-600"
              }`}>
                {p.stock === 0 ? "Agotado" : `${p.stock} pzas`}
              </span>

              {/* Editar */}
              <Link
                href={`/admin/productos/${p.id}`}
                className="p-1.5 text-gray-300 hover:text-[#C9A84C] hover:bg-[#F9F0E6] rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <Pencil size={13} />
              </Link>
            </div>
          ))}
        </div>

        {(products?.length ?? 0) > 8 && (
          <div className="border-t border-gray-50 px-5 py-3">
            <Link href="/admin/productos" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
              + {(products?.length ?? 0) - 8} productos más
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

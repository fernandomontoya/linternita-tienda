import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ArrowRight, ShoppingBag } from "lucide-react";
import AccountNav from "@/components/AccountNav";

export default async function MisPedidosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/cuenta/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const fmt = (p: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(p);

  const statusLabel: Record<string, { label: string; color: string }> = {
    pendiente:  { label: "Pendiente",   color: "bg-yellow-50 text-yellow-600" },
    pagado:     { label: "Pagado",      color: "bg-blue-50 text-blue-600" },
    en_proceso: { label: "En proceso",  color: "bg-purple-50 text-purple-600" },
    enviado:    { label: "Enviado",     color: "bg-indigo-50 text-indigo-600" },
    entregado:  { label: "Entregado",   color: "bg-green-50 text-green-600" },
    cancelado:  { label: "Cancelado",   color: "bg-red-50 text-red-500" },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <AccountNav userEmail={user.email ?? ""} />

      <h1 className="text-2xl font-bold text-[#2C1810] mb-6">Mis pedidos</h1>

      {!orders?.length ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E8C97A]/20">
          <ShoppingBag size={36} className="text-[#E8C97A] mx-auto mb-3" />
          <p className="font-semibold text-[#2C1810] mb-1">Aún no tienes pedidos</p>
          <p className="text-sm text-[#2C1810]/50 mb-6">Cuando hagas tu primera compra aparecerá aquí</p>
          <Link href="/catalogo" className="btn-gold px-7 py-3 rounded-full inline-flex items-center gap-2 text-sm font-semibold">
            Ver catálogo <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const st = statusLabel[order.status] ?? { label: order.status, color: "bg-gray-100 text-gray-600" };
            const items = order.items as { name: string; quantity: number; subtotal: number }[];
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-[#E8C97A]/20 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#F9F0E6] flex items-center justify-center">
                      <Package size={15} className="text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#2C1810]">Pedido #{order.order_number}</p>
                      <p className="text-xs text-[#2C1810]/40">
                        {new Date(order.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${st.color}`}>
                    {st.label}
                  </span>
                </div>

                {/* Productos */}
                <div className="px-5 py-3 space-y-1.5">
                  {items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-[#2C1810]/70">{item.name} × {item.quantity}</span>
                      <span className="font-medium text-[#2C1810]">{fmt(item.subtotal)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-3 bg-[#FAF7F2] border-t border-[#E8C97A]/20">
                  <span className="text-xs text-[#2C1810]/50">
                    {order.payment_method === "whatsapp" ? "💬 WhatsApp" : "💳 MercadoPago"}
                  </span>
                  <span className="font-bold text-[#C9A84C]">{fmt(Number(order.total))}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

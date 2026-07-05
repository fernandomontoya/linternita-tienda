import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ShoppingBag, PlusCircle } from "lucide-react";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";

export default async function AdminPedidosPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const fmt = (p: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(p);

  const methodLabel: Record<string, string> = {
    mercadopago: "💳 MercadoPago",
    whatsapp: "💬 WhatsApp",
    pendiente: "—",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-sm text-gray-400 mt-0.5">{orders?.length ?? 0} pedidos en total</p>
        </div>
        <Link href="/admin/pedidos/nuevo"
          className="flex items-center gap-1.5 btn-gold px-4 py-2 rounded-xl text-sm font-semibold">
          <PlusCircle size={15} /> Nuevo pedido
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"># Pedido</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Cliente</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Método</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Fecha</th>
                <th className="px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders?.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-5 py-3">
                    <span className="text-sm font-bold text-[#C9A84C]">#{order.order_number}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
                    <p className="text-xs text-gray-400 hidden sm:block">{order.customer_phone}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-gray-600">{methodLabel[order.payment_method] ?? order.payment_method}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-semibold text-gray-800">{fmt(Number(order.total))}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <OrderStatusBadge status={order.status} orderId={order.id} />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/pedidos/${order.id}`}
                      className="text-xs text-[#C9A84C] hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders?.length === 0 && (
          <div className="text-center py-16">
            <ShoppingBag size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">Aún no hay pedidos</p>
            <p className="text-xs text-gray-400 mt-1">Los pedidos aparecerán aquí cuando alguien compre</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { notFound } from "next/navigation";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import PagosSection, { Payment } from "@/components/admin/PagosSection";
import DeliveryDateEditor from "@/components/admin/DeliveryDateEditor";

export default async function AdminPedidoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: order }, { data: rawPayments }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).single(),
    supabase.from("payments").select("*").eq("order_id", id).order("paid_at"),
  ]);

  if (!order) notFound();

  const payments: Payment[] = (rawPayments ?? []).map((p) => ({
    id: p.id,
    amount: Number(p.amount),
    payment_type: p.payment_type,
    payment_method: p.payment_method,
    notes: p.notes ?? null,
    paid_at: p.paid_at,
  }));

  const fmt = (p: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(p);

  const items = order.items as {
    name: string; quantity: number; unitPrice: number; subtotal: number; aroma?: string; size?: string;
    eventDetails?: {
      ribbonColor?: string;
      cardColor?: string;
      presentationType?: string;
      eventName?: string;
      eventDate?: string;
      phrase?: string;
    };
  }[];

  const methodLabel: Record<string, string> = {
    mercadopago: "💳 MercadoPago",
    whatsapp: "💬 WhatsApp",
    pendiente: "—",
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/pedidos" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft size={15} /> Pedidos
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900">Pedido #{order.order_number}</h1>
            <OrderStatusBadge status={order.status} orderId={order.id} />
            {order.source === "manual" && (
              <span className="text-[10px] bg-purple-100 text-purple-600 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">Manual</span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Pedido: {new Date(order.created_at).toLocaleDateString("es-MX", { weekday: "long", day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
          <DeliveryDateEditor orderId={order.id} deliveryDate={order.delivery_date ?? null} />
        </div>
        <Link href={`/recibo/${order.id}`} target="_blank"
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#C9A84C] border border-gray-200 hover:border-[#C9A84C] px-3 py-2 rounded-xl transition-colors">
          <Printer size={13} /> Recibo
        </Link>
      </div>

      {/* Productos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <p className="text-sm font-semibold text-gray-900">Productos</p>
        </div>
        <div className="divide-y divide-gray-50">
          {items.map((item, i) => (
            <div key={i} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-400">
                  {[item.aroma, item.size].filter(Boolean).join(" · ")} · {item.quantity} pieza{item.quantity > 1 ? "s" : ""}
                </p>
                {item.eventDetails && (
                  <div className="text-xs text-[#C9A84C] mt-1 space-y-0.5">
                    {item.eventDetails.presentationType && <p>🎁 Presentación: {item.eventDetails.presentationType}</p>}
                    {item.eventDetails.ribbonColor && <p>🎀 Listón: {item.eventDetails.ribbonColor}</p>}
                    {item.eventDetails.cardColor && <p>🎴 Tarjeta: {item.eventDetails.cardColor}</p>}
                    {item.eventDetails.eventName && <p>🎉 Evento: {item.eventDetails.eventName}</p>}
                    {item.eventDetails.eventDate && <p>📅 Fecha: {item.eventDetails.eventDate}</p>}
                    {item.eventDetails.phrase && <p>💬 Frase: &quot;{item.eventDetails.phrase}&quot;</p>}
                  </div>
                )}
              </div>
              <p className="text-sm font-semibold text-gray-700">{fmt(item.subtotal)}</p>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-gray-50 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Total</span>
          <span className="text-lg font-bold text-[#C9A84C]">{fmt(Number(order.total))}</span>
        </div>
      </div>

      {/* Pagos */}
      <PagosSection orderId={order.id} orderTotal={Number(order.total)} initialPayments={payments} />

      {/* Cliente */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-semibold text-gray-900 mb-4">Datos del cliente</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Nombre</p>
            <p className="font-medium text-gray-800">{order.customer_name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Método de pago</p>
            <p className="font-medium text-gray-800">{methodLabel[order.payment_method] ?? order.payment_method}</p>
          </div>
          {order.customer_email && (
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Correo</p>
              <a href={`mailto:${order.customer_email}`} className="font-medium text-[#C9A84C] hover:underline">{order.customer_email}</a>
            </div>
          )}
          {order.customer_phone && (
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Teléfono</p>
              <a href={`https://wa.me/52${order.customer_phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                className="font-medium text-[#C9A84C] hover:underline">{order.customer_phone}</a>
            </div>
          )}
          {order.customer_address && (
            <div className="col-span-2">
              <p className="text-xs text-gray-400 mb-0.5">Dirección de envío</p>
              <p className="font-medium text-gray-800">{order.customer_address}</p>
            </div>
          )}
          {order.notes && (
            <div className="col-span-2">
              <p className="text-xs text-gray-400 mb-0.5">Notas internas</p>
              <p className="text-gray-600 text-sm">{order.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp */}
      {order.customer_phone && (
        <a
          href={`https://wa.me/52${order.customer_phone.replace(/\D/g, "")}?text=Hola%20${encodeURIComponent(order.customer_name.split(" ")[0])}!%20Te%20contactamos%20de%20Linternita%20sobre%20tu%20pedido%20%23${order.order_number}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-[#25D366] text-[#25D366] font-semibold text-sm hover:bg-[#25D366] hover:text-white transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
          Contactar a {order.customer_name.split(" ")[0]} por WhatsApp
        </a>
      )}
    </div>
  );
}

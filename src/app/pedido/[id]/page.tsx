import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { CheckCircle, MessageCircle, Package } from "lucide-react";
import { notFound } from "next/navigation";

export default async function PedidoConfirmacionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ metodo?: string }>;
}) {
  const { id } = await params;
  const { metodo } = await searchParams;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const fmt = (p: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(p);

  const items = order.items as {
    name: string; quantity: number; unitPrice: number; aroma?: string; size?: string; subtotal: number;
  }[];

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">

      {/* Ícono de éxito */}
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={32} className="text-green-500" />
      </div>

      <h1 className="text-2xl font-bold text-[#2C1810] mb-2">¡Pedido recibido!</h1>
      <p className="text-[#2C1810]/60 mb-1">Pedido <span className="font-semibold text-[#2C1810]">#{order.order_number}</span></p>
      <p className="text-sm text-[#2C1810]/50 mb-8">
        {metodo === "whatsapp"
          ? "Te abrimos WhatsApp para coordinar tu pago y envío."
          : "Pronto recibirás confirmación de tu pago por correo."}
      </p>

      {/* Resumen del pedido */}
      <div className="bg-white rounded-2xl border border-[#E8C97A]/20 p-5 text-left mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Package size={16} className="text-[#C9A84C]" />
          <p className="text-sm font-semibold text-[#2C1810]">Resumen</p>
        </div>
        <div className="space-y-2 mb-4">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-[#2C1810]/70">
                {item.name} x{item.quantity}
                {item.aroma ? ` — ${item.aroma}` : ""}
              </span>
              <span className="font-medium">{fmt(item.subtotal)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#E8C97A]/20 pt-3 flex justify-between font-bold text-[#2C1810]">
          <span>Total</span>
          <span className="text-[#C9A84C]">{fmt(Number(order.total))}</span>
        </div>
      </div>

      {/* Datos del cliente */}
      <div className="bg-[#F9F0E6] rounded-2xl p-5 text-left mb-8 text-sm text-[#2C1810]/70 space-y-1">
        <p><span className="font-medium text-[#2C1810]">Nombre:</span> {order.customer_name}</p>
        {order.customer_email && <p><span className="font-medium text-[#2C1810]">Correo:</span> {order.customer_email}</p>}
        {order.customer_phone && <p><span className="font-medium text-[#2C1810]">Teléfono:</span> {order.customer_phone}</p>}
        <p><span className="font-medium text-[#2C1810]">Dirección:</span> {order.customer_address}</p>
      </div>

      {/* Acciones */}
      <div className="flex flex-col gap-3">
        {metodo === "whatsapp" && (
          <a
            href={`https://wa.me/5215563442525?text=Hola!%20Quiero%20seguimiento%20de%20mi%20pedido%20%23${order.order_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-xl border-2 border-[#25D366] text-[#25D366] font-semibold flex items-center justify-center gap-2 hover:bg-[#25D366] hover:text-white transition-colors"
          >
            <MessageCircle size={18} /> Contactar por WhatsApp
          </a>
        )}
        <Link href="/catalogo" className="btn-gold w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold">
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}

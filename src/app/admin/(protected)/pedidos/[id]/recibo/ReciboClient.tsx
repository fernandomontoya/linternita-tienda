"use client";

import { useEffect } from "react";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface OrderItem {
  id?: string | null;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  aroma?: string;
  size?: string;
  eventDetails?: {
    ribbonColor?: string;
    presentationType?: string;
    eventName?: string;
    eventDate?: string;
    phrase?: string;
  };
}

interface Order {
  id: string;
  order_number: number;
  created_at: string;
  delivery_date?: string | null;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  notes?: string;
  items: OrderItem[];
  total: number;
  status: string;
  source?: string;
}

interface Payment {
  id: string;
  amount: number;
  payment_type: string;
  payment_method: string;
  notes: string | null;
  paid_at: string;
}

const TYPE_LABELS: Record<string, string> = {
  anticipo: "Anticipo",
  abono: "Abono",
  total: "Pago total",
  parcialidad: "Parcialidad",
};

const METHOD_LABELS: Record<string, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  tarjeta: "Tarjeta",
};

const fmt = (p: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(p);

export default function ReciboClient({ order, payments }: { order: Order; payments: Payment[] }) {
  const totalPaid = payments.reduce((s, p) => s + Number(p.amount), 0);
  const balance = Number(order.total) - totalPaid;
  const items = order.items as OrderItem[];

  useEffect(() => {
    // Añadir estilos de impresión al head solo en cliente
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        .no-print { display: none !important; }
        body { background: white !important; }
        .print-container { box-shadow: none !important; border: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div>
      {/* Controles — ocultos al imprimir */}
      <div className="no-print flex items-center gap-4 mb-6">
        <Link href={`/admin/pedidos/${order.id}`} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft size={15} /> Volver al pedido
        </Link>
        <button
          onClick={() => window.print()}
          className="ml-auto flex items-center gap-2 btn-gold px-5 py-2.5 rounded-xl font-semibold text-sm"
        >
          <Printer size={16} /> Imprimir recibo
        </button>
      </div>

      {/* Recibo */}
      <div className="print-container max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6 text-[#2C1810]">

        {/* Encabezado */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xl font-bold text-[#C9A84C]">Linternita</p>
            <p className="text-sm text-gray-500">Velas Artesanales</p>
            <p className="text-xs text-gray-400 mt-0.5">linternita.com.mx · contacto@linternita.com.mx</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">Recibo #{order.order_number}</p>
            <p className="text-xs text-gray-400 mt-1">
              Pedido: {new Date(order.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
            {order.delivery_date && (
              <p className="text-xs text-[#C9A84C] font-medium mt-0.5">
                Entrega: {new Date(order.delivery_date + "T12:00:00").toLocaleDateString("es-MX", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-dashed border-gray-200" />

        {/* Datos del cliente */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Cliente</p>
            <p className="font-semibold">{order.customer_name}</p>
            {order.customer_phone && <p className="text-gray-500">{order.customer_phone}</p>}
            {order.customer_email && <p className="text-gray-500">{order.customer_email}</p>}
          </div>
          {order.customer_address && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Dirección de entrega</p>
              <p className="text-gray-600">{order.customer_address}</p>
            </div>
          )}
        </div>

        {/* Productos */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Productos</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-400">
                <th className="text-left pb-2 font-medium">Descripción</th>
                <th className="text-center pb-2 font-medium w-12">Cant.</th>
                <th className="text-right pb-2 font-medium w-24">P. Unit.</th>
                <th className="text-right pb-2 font-medium w-24">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="py-2.5 pr-4">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    {(item.aroma || item.size) && (
                      <p className="text-xs text-gray-400">{[item.aroma, item.size].filter(Boolean).join(" · ")}</p>
                    )}
                    {item.eventDetails && (
                      <div className="text-xs text-[#C9A84C] mt-0.5 space-y-0.5">
                        {item.eventDetails.presentationType && <p>Presentación: {item.eventDetails.presentationType}</p>}
                        {item.eventDetails.ribbonColor && <p>Listón: {item.eventDetails.ribbonColor}</p>}
                        {item.eventDetails.eventName && <p>Evento: {item.eventDetails.eventName}</p>}
                        {item.eventDetails.eventDate && <p>Fecha: {item.eventDetails.eventDate}</p>}
                        {item.eventDetails.phrase && <p>Frase: "{item.eventDetails.phrase}"</p>}
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 text-center text-gray-600">{item.quantity}</td>
                  <td className="py-2.5 text-right text-gray-600">{fmt(item.unitPrice)}</td>
                  <td className="py-2.5 text-right font-semibold text-gray-800">{fmt(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Total del pedido</span>
          <span className="text-xl font-bold text-[#C9A84C]">{fmt(Number(order.total))}</span>
        </div>

        {/* Historial de pagos */}
        {payments.length > 0 && (
          <div>
            <div className="border-t border-dashed border-gray-200 mb-4" />
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Historial de pagos</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400">
                  <th className="text-left pb-2 font-medium">Fecha</th>
                  <th className="text-left pb-2 font-medium">Concepto</th>
                  <th className="text-left pb-2 font-medium">Método</th>
                  <th className="text-right pb-2 font-medium">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 text-gray-600 text-xs">
                      {new Date(p.paid_at + "T12:00:00").toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-2 text-gray-700">
                      <p>{TYPE_LABELS[p.payment_type] ?? p.payment_type}</p>
                      {p.notes && <p className="text-xs text-gray-400">{p.notes}</p>}
                    </td>
                    <td className="py-2 text-gray-500 text-xs">{METHOD_LABELS[p.payment_method] ?? p.payment_method}</td>
                    <td className="py-2 text-right font-semibold text-gray-800">{fmt(Number(p.amount))}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 space-y-1.5 text-sm border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Total pagado</span>
                <span className="font-semibold text-green-600">{fmt(totalPaid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Saldo pendiente</span>
                <span className={`font-bold text-base ${balance > 0 ? "text-red-500" : "text-green-600"}`}>
                  {fmt(Math.max(0, balance))}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Notas */}
        {order.notes && (
          <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600">
            <p className="text-xs text-gray-400 mb-1">Notas</p>
            {order.notes}
          </div>
        )}

        {/* Pie */}
        <div className="border-t border-dashed border-gray-200 pt-4 text-center">
          <p className="text-xs text-gray-400">Este documento es solo informativo y <strong>no tiene validez fiscal.</strong></p>
          <p className="text-xs text-gray-300 mt-1">Linternita Velas Artesanales · linternita.com.mx</p>
        </div>
      </div>
    </div>
  );
}

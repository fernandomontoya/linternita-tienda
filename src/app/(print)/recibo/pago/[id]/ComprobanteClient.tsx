"use client";

import { useEffect } from "react";
import { Printer, ArrowLeft } from "lucide-react";
import Image from "next/image";

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

const fmt = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(n);

interface Payment {
  id: string;
  amount: number;
  payment_type: string;
  payment_method: string;
  notes: string | null;
  paid_at: string;
  created_at: string;
}

interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  total: number;
  status: string;
  created_at: string;
  delivery_date?: string | null;
}

export default function ComprobanteClient({
  payment,
  order,
  totalPagadoHasta,
  pagoNumero,
  totalPagos,
}: {
  payment: Payment;
  order: Order;
  totalPagadoHasta: number;
  pagoNumero: number;
  totalPagos: number;
}) {
  const saldoPendiente = Math.max(0, Number(order.total) - totalPagadoHasta);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      header.sticky, footer, .fixed.bottom-6 { display: none !important; }
      body { background: white !important; }
      @media print {
        .no-print { display: none !important; }
        .print-card { box-shadow: none !important; border: none !important; border-radius: 0 !important; }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const fechaPago = new Date(payment.paid_at + "T12:00:00").toLocaleDateString("es-MX", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });

  const fechaPedido = new Date(order.created_at).toLocaleDateString("es-MX", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <div>
      {/* Controles — ocultos al imprimir */}
      <div className="no-print flex items-center gap-4 mb-6 max-w-lg mx-auto px-4 pt-6">
        <button onClick={() => window.close()} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft size={15} /> Cerrar
        </button>
        <button
          onClick={() => window.print()}
          className="ml-auto flex items-center gap-2 btn-gold px-5 py-2.5 rounded-xl font-semibold text-sm"
        >
          <Printer size={16} /> Imprimir / Guardar PDF
        </button>
      </div>

      {/* Comprobante */}
      <div className="print-card max-w-lg mx-auto mb-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5 text-[#2C1810]">

        {/* Encabezado */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Linternita" width={48} height={48} className="rounded-full" />
            <div>
              <p className="text-lg font-bold text-[#C9A84C]">Linternita</p>
              <p className="text-xs text-gray-500">Velas Artesanales</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800">Comprobante de pago</p>
            <p className="text-xs text-gray-400 mt-1">Pago {pagoNumero} de {totalPagos}</p>
            <p className="text-xs text-gray-400 mt-0.5">{fechaPago}</p>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-200" />

        {/* Cliente */}
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Cliente</p>
          <p className="font-semibold text-gray-800">{order.customer_name}</p>
          {order.customer_phone && <p className="text-sm text-gray-500">{order.customer_phone}</p>}
          {order.customer_email && <p className="text-sm text-gray-500">{order.customer_email}</p>}
        </div>

        {/* Info del pedido */}
        <div className="bg-gray-50 rounded-xl p-4 text-sm grid grid-cols-2 gap-y-1.5">
          <span className="text-gray-400">Fecha del pedido</span>
          <span className="text-right text-gray-700 font-medium">{fechaPedido}</span>
          {order.delivery_date && (
            <>
              <span className="text-gray-400">Fecha de entrega</span>
              <span className="text-right text-[#C9A84C] font-medium">
                {new Date(order.delivery_date + "T12:00:00").toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
              </span>
            </>
          )}
          <span className="text-gray-400">Total del pedido</span>
          <span className="text-right font-semibold text-gray-800">{fmt(Number(order.total))}</span>
        </div>

        {/* Detalle del pago — bloque destacado */}
        <div className="border-2 border-[#C9A84C]/30 rounded-2xl p-5 space-y-3 bg-[#FEF9EE]">
          <p className="text-xs font-semibold text-[#C9A84C] uppercase tracking-wide">Este pago</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-gray-800">{TYPE_LABELS[payment.payment_type] ?? payment.payment_type}</p>
              <p className="text-sm text-gray-500">{METHOD_LABELS[payment.payment_method] ?? payment.payment_method}</p>
              {payment.notes && <p className="text-xs text-gray-400 mt-0.5">{payment.notes}</p>}
            </div>
            <p className="text-3xl font-bold text-[#C9A84C]">{fmt(Number(payment.amount))}</p>
          </div>
        </div>

        {/* Resumen financiero */}
        <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Total pagado hasta ahora</span>
            <span className="font-semibold text-green-600">{fmt(totalPagadoHasta)}</span>
          </div>
          <div className="flex justify-between border-t border-dashed border-gray-200 pt-2">
            <span className="font-bold text-gray-700">Saldo pendiente</span>
            <span className={`text-lg font-bold ${saldoPendiente > 0 ? "text-red-500" : "text-green-600"}`}>
              {fmt(saldoPendiente)}
            </span>
          </div>
          {saldoPendiente === 0 && (
            <p className="text-center text-xs font-semibold text-green-600 bg-green-50 rounded-lg py-1.5">
              ✓ Pedido liquidado
            </p>
          )}
        </div>

        {/* Pie */}
        <div className="border-t border-dashed border-gray-200 pt-4 text-center">
          <p className="text-xs text-gray-400">Este comprobante <strong>no tiene validez fiscal.</strong></p>
          <p className="text-xs text-gray-300 mt-1">Linternita Velas Artesanales · linternita.com.mx</p>
        </div>
      </div>
    </div>
  );
}

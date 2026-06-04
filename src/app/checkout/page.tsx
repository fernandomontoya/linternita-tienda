"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const { items, total } = useCart();

  const formatted = (price: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(price);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-6">🕯️</p>
        <h2 className="text-xl font-bold text-[#2C1810] mb-4">No hay productos en tu carrito</h2>
        <Link href="/catalogo" className="btn-gold px-8 py-3.5 rounded-full inline-flex items-center gap-2">
          <ShoppingBag size={18} /> Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/carrito" className="flex items-center gap-2 text-sm text-[#2C1810]/60 hover:text-[#C9A84C] transition-colors mb-8">
        <ArrowLeft size={16} /> Volver al carrito
      </Link>

      <h1 className="text-3xl font-bold text-[#2C1810] mb-8">Finalizar Pedido</h1>

      {/* Resumen */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8C97A]/20 mb-8">
        <h2 className="font-semibold text-[#2C1810] mb-4">Tu pedido</h2>
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm py-2 border-b border-[#E8C97A]/20 last:border-0">
            <span className="text-[#2C1810]/80">
              {item.product.name} x{item.quantity}
              {item.selectedAroma ? ` — ${item.selectedAroma}` : ""}
            </span>
            <span className="font-semibold">{formatted(item.unitPrice * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-[#C9A84C] mt-4 text-lg">
          <span>Total</span>
          <span>{formatted(total)}</span>
        </div>
      </div>

      {/* Datos del cliente */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8C97A]/20 mb-8">
        <h2 className="font-semibold text-[#2C1810] mb-4">Tus datos</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#2C1810]/70 mb-1 block">Nombre</label>
              <input type="text" placeholder="Tu nombre" className="w-full border border-[#E8C97A]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#2C1810]/70 mb-1 block">Apellido</label>
              <input type="text" placeholder="Tu apellido" className="w-full border border-[#E8C97A]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#2C1810]/70 mb-1 block">Correo electrónico</label>
            <input type="email" placeholder="tu@correo.com" className="w-full border border-[#E8C97A]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]" />
          </div>
          <div>
            <label className="text-xs font-medium text-[#2C1810]/70 mb-1 block">Teléfono / WhatsApp</label>
            <input type="tel" placeholder="+52 55 0000 0000" className="w-full border border-[#E8C97A]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]" />
          </div>
          <div>
            <label className="text-xs font-medium text-[#2C1810]/70 mb-1 block">Dirección de envío</label>
            <textarea rows={3} placeholder="Calle, número, colonia, ciudad, estado, CP" className="w-full border border-[#E8C97A]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] resize-none" />
          </div>
        </div>
      </div>

      {/* MercadoPago placeholder */}
      <div className="bg-[#F9F0E6] rounded-2xl p-6 border border-[#E8C97A]/30 text-center">
        <p className="text-sm font-semibold text-[#2C1810] mb-2">Pago seguro con MercadoPago</p>
        <p className="text-xs text-[#2C1810]/60 mb-4">Tarjeta de crédito, débito, OXXO, transferencia y más.</p>
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          {["VISA", "Mastercard", "OXXO", "SPEI"].map((m) => (
            <span key={m} className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-[#2C1810]/50 border border-[#E8C97A]/40">
              {m}
            </span>
          ))}
        </div>
        <button className="btn-gold w-full py-4 rounded-xl text-base">
          Pagar {formatted(total)} con MercadoPago
        </button>
        <p className="text-[10px] text-[#2C1810]/40 mt-3">
          * La integración con MercadoPago se configura con tus credenciales de cuenta.
        </p>
      </div>
    </div>
  );
}

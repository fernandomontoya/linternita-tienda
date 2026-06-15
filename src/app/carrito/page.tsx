"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { toast } = useToast();

  const handleClearCart = () => {
    if (items.length === 0) return;
    if (confirm("¿Vaciar el carrito? Perderás todos los productos agregados.")) {
      clearCart();
      toast("Carrito vaciado", "error");
    }
  };

  const formatted = (price: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(price);

  const whatsappSummary = encodeURIComponent(
    "Hola! Quisiera hacer el siguiente pedido:\n\n" +
      items
        .map((item) => {
          let line = `• ${item.product.name}${item.selectedAroma ? ` (${item.selectedAroma})` : ""}${item.selectedSize ? ` — ${item.selectedSize}` : ""} x${item.quantity} = ${formatted(item.unitPrice * item.quantity)}`;
          if (item.eventDetails) {
            const d = item.eventDetails;
            if (d.ribbonColor) line += `\n   Listón: ${d.ribbonColor}`;
            if (d.cardColor) line += `\n   Tarjeta: ${d.cardColor}`;
            if (d.eventName) line += `\n   Evento: ${d.eventName}`;
            if (d.eventDate) line += `\n   Fecha: ${d.eventDate}`;
            if (d.phrase) line += `\n   Frase: ${d.phrase}`;
          }
          return line;
        })
        .join("\n") +
      `\n\n*Total: ${formatted(total)}*`
  );

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-6">🕯️</p>
        <h2 className="text-2xl font-bold text-[#2C1810] mb-3">Tu carrito está vacío</h2>
        <p className="text-[#2C1810]/60 mb-8">Descubre nuestras velas artesanales y encuentra tu aroma favorito.</p>
        <Link href="/catalogo" className="btn-gold px-8 py-3.5 rounded-full inline-flex items-center gap-2">
          <ShoppingBag size={18} /> Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <Link href="/catalogo" className="flex items-center gap-2 text-sm text-[#2C1810]/60 hover:text-[#C9A84C] transition-colors">
          <ArrowLeft size={16} /> Seguir comprando
        </Link>
        <h1 className="text-2xl font-bold text-[#2C1810]">Tu Carrito</h1>
        <button onClick={handleClearCart} className="text-xs text-[#2C1810]/40 hover:text-red-400 transition-colors">
          Vaciar
        </button>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-8">
        {/* Productos */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-[#E8C97A]/20">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F9F0E6] flex-shrink-0 relative">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23F9F0E6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23C9A84C' font-size='60'%3E🕯️%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#2C1810]">{item.product.name}</p>
                {item.selectedAroma && <p className="text-xs text-[#2C1810]/60">Aroma: {item.selectedAroma}</p>}
                {item.selectedSize && <p className="text-xs text-[#2C1810]/60">Tamaño: {item.selectedSize}</p>}
                {item.eventDetails && (
                  <div className="text-xs text-[#2C1810]/60 mt-1 space-y-0.5">
                    {item.eventDetails.ribbonColor && <p>🎀 Listón: {item.eventDetails.ribbonColor}</p>}
                    {item.eventDetails.cardColor && <p>🎴 Tarjeta: {item.eventDetails.cardColor}</p>}
                    {item.eventDetails.eventName && <p>🎉 Evento: {item.eventDetails.eventName}</p>}
                    {item.eventDetails.eventDate && <p>📅 Fecha: {item.eventDetails.eventDate}</p>}
                    {item.eventDetails.phrase && <p>💬 Frase: {item.eventDetails.phrase}</p>}
                  </div>
                )}
                <p className="text-sm font-bold text-[#C9A84C] mt-1">{formatted(item.unitPrice)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    className="w-7 h-7 rounded-full border border-[#C9A84C]/50 text-[#C9A84C] text-sm hover:bg-[#C9A84C] hover:text-white transition-all"
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border border-[#C9A84C]/50 text-[#C9A84C] text-sm hover:bg-[#C9A84C] hover:text-white transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeItem(index)} className="text-[#2C1810]/30 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
                <p className="font-bold text-[#2C1810]">{formatted(item.unitPrice * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8C97A]/20 sticky top-24">
            <h2 className="font-bold text-[#2C1810] mb-4">Resumen</h2>
            <div className="space-y-2 text-sm text-[#2C1810]/70 mb-4">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>{item.product.name} x{item.quantity}</span>
                  <span>{formatted(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E8C97A]/30 pt-4 flex justify-between font-bold text-[#2C1810] mb-6">
              <span>Total</span>
              <span className="text-[#C9A84C] text-lg">{formatted(total)}</span>
            </div>

            <Link
              href="/checkout"
              className="btn-gold w-full py-3.5 rounded-full flex items-center justify-center gap-2 font-semibold"
            >
              <ShoppingBag size={18} /> Ir a pagar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

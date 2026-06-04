"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, AlertCircle } from "lucide-react";

interface FormField {
  value: string;
  error: string;
  touched: boolean;
}

const empty = (): FormField => ({ value: "", error: "", touched: false });

const validators: Record<string, (v: string) => string> = {
  nombre: (v) => (!v.trim() ? "El nombre es requerido" : ""),
  apellido: (v) => (!v.trim() ? "El apellido es requerido" : ""),
  email: (v) => (!v.trim() ? "El correo es requerido" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Correo inválido" : ""),
  telefono: (v) => (!v.trim() ? "El teléfono es requerido" : v.replace(/\D/g, "").length < 10 ? "Mínimo 10 dígitos" : ""),
  direccion: (v) => (!v.trim() ? "La dirección es requerida" : v.trim().length < 10 ? "Escribe la dirección completa" : ""),
};

export default function CheckoutPage() {
  const { items, total } = useCart();
  const [fields, setFields] = useState({
    nombre: empty(), apellido: empty(), email: empty(), telefono: empty(), direccion: empty(),
  });

  const fmt = (p: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(p);

  const update = (name: keyof typeof fields, value: string) => {
    const error = fields[name].touched ? validators[name](value) : "";
    setFields((f) => ({ ...f, [name]: { value, error, touched: f[name].touched } }));
  };

  const blur = (name: keyof typeof fields) => {
    const error = validators[name](fields[name].value);
    setFields((f) => ({ ...f, [name]: { ...f[name], error, touched: true } }));
  };

  const isValid = Object.entries(fields).every(([k, f]) => !validators[k as keyof typeof fields](f.value));

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

  const Field = ({
    name, label, type = "text", rows,
  }: { name: keyof typeof fields; label: string; type?: string; rows?: number }) => {
    const f = fields[name];
    const hasError = f.touched && !!f.error;
    const base = "w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors duration-150";
    const cls = hasError
      ? `${base} border-red-300 bg-red-50 focus:border-red-400`
      : `${base} border-gray-200 focus:border-[#C9A84C]`;

    return (
      <div>
        <label className="text-xs font-medium text-[#2C1810]/70 block mb-1">
          {label} <span className="text-[#C9A84C]">*</span>
        </label>
        {rows ? (
          <textarea rows={rows} value={f.value} onChange={(e) => update(name, e.target.value)}
            onBlur={() => blur(name)} className={`${cls} resize-none`} placeholder={label} />
        ) : (
          <input type={type} value={f.value} onChange={(e) => update(name, e.target.value)}
            onBlur={() => blur(name)} className={cls} placeholder={label} />
        )}
        {hasError && (
          <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
            <AlertCircle size={11} /> {f.error}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/carrito" className="flex items-center gap-2 text-sm text-[#2C1810]/60 hover:text-[#C9A84C] transition-colors mb-8">
        <ArrowLeft size={16} /> Volver al carrito
      </Link>
      <h1 className="text-3xl font-bold text-[#2C1810] mb-8">Finalizar Pedido</h1>

      {/* Resumen */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8C97A]/20 mb-6">
        <h2 className="font-semibold text-[#2C1810] mb-4">Tu pedido</h2>
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm py-2 border-b border-[#E8C97A]/20 last:border-0">
            <span className="text-[#2C1810]/80">
              {item.product.name} x{item.quantity}
              {item.selectedAroma ? ` — ${item.selectedAroma}` : ""}
            </span>
            <span className="font-semibold">{fmt(item.unitPrice * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-[#C9A84C] mt-4 text-lg">
          <span>Total</span><span>{fmt(total)}</span>
        </div>
      </div>

      {/* Datos */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8C97A]/20 mb-6">
        <h2 className="font-semibold text-[#2C1810] mb-5">Tus datos</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field name="nombre" label="Nombre" />
            <Field name="apellido" label="Apellido" />
          </div>
          <Field name="email" label="Correo electrónico" type="email" />
          <Field name="telefono" label="Teléfono / WhatsApp" type="tel" />
          <Field name="direccion" label="Dirección de envío" rows={3} />
        </div>
      </div>

      {/* Pago */}
      <div className="bg-[#F9F0E6] rounded-2xl p-6 border border-[#E8C97A]/30">
        <p className="text-sm font-semibold text-[#2C1810] mb-1">Pago seguro con MercadoPago</p>
        <p className="text-xs text-[#2C1810]/60 mb-4">Tarjeta, OXXO, transferencia SPEI y más.</p>
        <div className="flex gap-2 mb-5 flex-wrap">
          {["VISA", "Mastercard", "OXXO", "SPEI"].map((m) => (
            <span key={m} className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-[#2C1810]/40 border border-[#E8C97A]/40">{m}</span>
          ))}
        </div>
        <button
          disabled={!isValid}
          className="btn-gold w-full py-4 rounded-xl text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {isValid ? `Pagar ${fmt(total)} con MercadoPago` : "Completa tus datos para continuar"}
        </button>
        {!isValid && (
          <p className="text-xs text-center text-[#2C1810]/40 mt-2">Todos los campos con * son obligatorios</p>
        )}
      </div>
    </div>
  );
}

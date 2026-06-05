"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";

const validators: Record<string, (v: string) => string> = {
  nombre:    (v) => !v.trim() ? "El nombre es requerido" : "",
  apellido:  (v) => !v.trim() ? "El apellido es requerido" : "",
  email:     (v) => !v.trim() ? "El correo es requerido" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Correo inválido" : "",
  telefono:  (v) => !v.trim() ? "El teléfono es requerido" : v.replace(/\D/g, "").length < 10 ? "Mínimo 10 dígitos" : "",
  direccion: (v) => !v.trim() ? "La dirección es requerida" : v.trim().length < 10 ? "Escribe la dirección completa" : "",
};

const base = "w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors duration-150 border-gray-200 focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10";
const errCls = "w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none border-red-300 bg-red-50 focus:border-red-400";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Inputs no controlados — sin re-render al escribir
  const refs = {
    nombre:    useRef<HTMLInputElement>(null),
    apellido:  useRef<HTMLInputElement>(null),
    email:     useRef<HTMLInputElement>(null),
    telefono:  useRef<HTMLInputElement>(null),
    direccion: useRef<HTMLTextAreaElement>(null),
  };

  const fmt = (p: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(p);

  const getValues = () => ({
    nombre:    refs.nombre.current?.value ?? "",
    apellido:  refs.apellido.current?.value ?? "",
    email:     refs.email.current?.value ?? "",
    telefono:  refs.telefono.current?.value ?? "",
    direccion: refs.direccion.current?.value ?? "",
  });

  const validateAll = () => {
    const vals = getValues();
    const newErrors: Record<string, string> = {};
    Object.entries(validators).forEach(([k, fn]) => {
      const err = fn(vals[k as keyof typeof vals]);
      if (err) newErrors[k] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (name: string) => {
    const val = (refs[name as keyof typeof refs] as React.RefObject<HTMLInputElement | HTMLTextAreaElement>)?.current?.value ?? "";
    const err = validators[name](val);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const saveOrder = async (paymentMethod: string) => {
    if (!validateAll()) return null;
    setSubmitting(true);
    const vals = getValues();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_name: `${vals.nombre} ${vals.apellido}`.trim(),
        customer_email: vals.email,
        customer_phone: vals.telefono,
        customer_address: vals.direccion,
        user_id: user?.id ?? null,
        items: items.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          aroma: item.selectedAroma,
          size: item.selectedSize,
          subtotal: item.unitPrice * item.quantity,
        })),
        total,
        payment_method: paymentMethod,
        status: "pendiente",
      })
      .select("id, order_number")
      .single();
    setSubmitting(false);
    if (error || !data) return null;
    return data;
  };

  const handleMercadoPago = async () => {
    const order = await saveOrder("mercadopago");
    if (!order) return;
    clearCart();
    router.push(`/pedido/${order.id}?metodo=mercadopago`);
  };

  const handleWhatsApp = async () => {
    const order = await saveOrder("whatsapp");
    if (!order) return;
    const vals = getValues();
    const msg = encodeURIComponent(
      `Hola! Quiero hacer el pedido #${order.order_number}:\n\n` +
      items.map((i) => `• ${i.product.name}${i.selectedAroma ? ` (${i.selectedAroma})` : ""} x${i.quantity} = ${fmt(i.unitPrice * i.quantity)}`).join("\n") +
      `\n\n*Total: ${fmt(total)}*\n\nMi dirección: ${vals.direccion}`
    );
    clearCart();
    router.push(`/pedido/${order.id}?metodo=whatsapp`);
    window.open(`https://wa.me/5215563442525?text=${msg}`, "_blank");
  };

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
      <div className="bg-white rounded-2xl p-6 border border-[#E8C97A]/20 mb-6">
        <h2 className="font-semibold text-[#2C1810] mb-4">Tu pedido</h2>
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm py-2 border-b border-[#E8C97A]/20 last:border-0">
            <span className="text-[#2C1810]/80">
              {item.product.name} x{item.quantity}
              {item.selectedAroma ? ` — ${item.selectedAroma}` : ""}
              {item.selectedSize ? ` (${item.selectedSize})` : ""}
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
            <div>
              <label className="text-xs font-medium text-[#2C1810]/70 block mb-1.5">Nombre <span className="text-[#C9A84C]">*</span></label>
              <input ref={refs.nombre} type="text" placeholder="Tu nombre"
                className={errors.nombre ? errCls : base}
                onBlur={() => handleBlur("nombre")} />
              {errors.nombre && <p className="flex items-center gap-1 mt-1 text-xs text-red-500"><AlertCircle size={11} />{errors.nombre}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-[#2C1810]/70 block mb-1.5">Apellido <span className="text-[#C9A84C]">*</span></label>
              <input ref={refs.apellido} type="text" placeholder="Tu apellido"
                className={errors.apellido ? errCls : base}
                onBlur={() => handleBlur("apellido")} />
              {errors.apellido && <p className="flex items-center gap-1 mt-1 text-xs text-red-500"><AlertCircle size={11} />{errors.apellido}</p>}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#2C1810]/70 block mb-1.5">Correo electrónico <span className="text-[#C9A84C]">*</span></label>
            <input ref={refs.email} type="email" placeholder="tu@correo.com"
              className={errors.email ? errCls : base}
              onBlur={() => handleBlur("email")} />
            {errors.email && <p className="flex items-center gap-1 mt-1 text-xs text-red-500"><AlertCircle size={11} />{errors.email}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-[#2C1810]/70 block mb-1.5">Teléfono / WhatsApp <span className="text-[#C9A84C]">*</span></label>
            <input ref={refs.telefono} type="tel" placeholder="55 0000 0000"
              className={errors.telefono ? errCls : base}
              onBlur={() => handleBlur("telefono")} />
            {errors.telefono && <p className="flex items-center gap-1 mt-1 text-xs text-red-500"><AlertCircle size={11} />{errors.telefono}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-[#2C1810]/70 block mb-1.5">Dirección de envío <span className="text-[#C9A84C]">*</span></label>
            <textarea ref={refs.direccion} rows={3} placeholder="Calle, número, colonia, ciudad, CP"
              className={`${errors.direccion ? errCls : base} resize-none`}
              onBlur={() => handleBlur("direccion")} />
            {errors.direccion && <p className="flex items-center gap-1 mt-1 text-xs text-red-500"><AlertCircle size={11} />{errors.direccion}</p>}
          </div>
        </div>
      </div>

      {/* Métodos de pago */}
      <div className="bg-[#F9F0E6] rounded-2xl p-6 border border-[#E8C97A]/30 space-y-3">
        <p className="text-sm font-semibold text-[#2C1810] mb-4">¿Cómo quieres pagar?</p>
        <button onClick={handleMercadoPago} disabled={submitting}
          className="btn-gold w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold disabled:opacity-50">
          {submitting ? <Loader2 size={18} className="animate-spin" /> : "💳"} Pagar con MercadoPago
        </button>
        <button onClick={handleWhatsApp} disabled={submitting}
          className="w-full py-4 rounded-xl border-2 border-[#25D366] text-[#25D366] font-semibold flex items-center justify-center gap-2 hover:bg-[#25D366] hover:text-white transition-colors disabled:opacity-50">
          {submitting ? <Loader2 size={18} className="animate-spin" /> : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
          )} Pedir por WhatsApp
        </button>
      </div>
    </div>
  );
}

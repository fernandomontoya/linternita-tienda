"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, ArrowLeft, Loader2, Package } from "lucide-react";
import Link from "next/link";

interface CatalogProduct {
  id: string;
  name: string;
  price: number;
  price_promo: number | null;
  aromas: string[] | null;
  sizes: { id: string; name: string; priceModifier: number; isPackage?: boolean }[] | null;
  stock: number;
  category: string;
  image_url: string | null;
}

interface LineItem {
  key: string;
  productId: string | null;
  name: string;
  aroma: string;
  size: string;
  unitPrice: number;
  quantity: number;
}

const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C] bg-white";

const fmt = (p: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(p);

export default function NuevoPedidoClient({ products }: { products: CatalogProduct[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Customer
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  // Items
  const [items, setItems] = useState<LineItem[]>([]);

  // Add from catalog
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [addAroma, setAddAroma] = useState("");
  const [addSize, setAddSize] = useState("");
  const [addQty, setAddQty] = useState(1);

  // Add custom item
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [customQty, setCustomQty] = useState(1);
  const [showCustom, setShowCustom] = useState(false);

  const total = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);

  const handleSelectProduct = (productId: string) => {
    const p = products.find((x) => x.id === productId) ?? null;
    setSelectedProduct(p);
    setAddAroma(p?.aromas?.[0] ?? "");
    setAddSize(p?.sizes?.[0]?.id ?? "");
    setAddQty(1);
  };

  const getUnitPrice = (p: CatalogProduct, sizeId: string) => {
    const sz = p.sizes?.find((s) => s.id === sizeId);
    const base = p.price_promo && p.price_promo < p.price ? p.price_promo : p.price;
    if (!sz) return base;
    return sz.isPackage ? sz.priceModifier : base + sz.priceModifier;
  };

  const addFromCatalog = () => {
    if (!selectedProduct) return;
    const sz = selectedProduct.sizes?.find((s) => s.id === addSize);
    const unitPrice = getUnitPrice(selectedProduct, addSize);
    setItems((prev) => [
      ...prev,
      {
        key: `${Date.now()}`,
        productId: selectedProduct.id,
        name: selectedProduct.name,
        aroma: addAroma,
        size: sz?.name ?? "",
        unitPrice,
        quantity: addQty,
      },
    ]);
    setSelectedProduct(null);
    setAddAroma("");
    setAddSize("");
    setAddQty(1);
  };

  const addCustomItem = () => {
    const price = parseFloat(customPrice);
    if (!customName.trim() || isNaN(price) || price <= 0) return;
    setItems((prev) => [
      ...prev,
      {
        key: `custom-${Date.now()}`,
        productId: null,
        name: customName.trim(),
        aroma: "",
        size: "",
        unitPrice: price,
        quantity: customQty,
      },
    ]);
    setCustomName("");
    setCustomPrice("");
    setCustomQty(1);
    setShowCustom(false);
  };

  const removeItem = (key: string) => setItems((prev) => prev.filter((i) => i.key !== key));

  const updateQty = (key: string, qty: number) =>
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, qty) } : i)));

  const handleSave = async () => {
    if (!customerName.trim()) return alert("El nombre del cliente es requerido");
    if (items.length === 0) return alert("Agrega al menos un producto");
    setSaving(true);
    const supabase = createClient();

    const orderItems = items.map((it) => ({
      id: it.productId,
      name: it.name,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      aroma: it.aroma || undefined,
      size: it.size || undefined,
      subtotal: it.unitPrice * it.quantity,
    }));

    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim() || null,
        customer_phone: customerPhone.trim() || null,
        customer_address: customerAddress.trim() || null,
        notes: notes.trim() || null,
        delivery_date: deliveryDate || null,
        items: orderItems,
        total,
        payment_method: "whatsapp",
        status: "pendiente",
        source: "manual",
        user_id: null,
      })
      .select("id, order_number")
      .single();

    setSaving(false);
    if (error || !data) return alert("Error al guardar el pedido: " + error?.message);
    router.push(`/admin/pedidos/${data.id}`);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/pedidos" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft size={15} /> Pedidos
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Nuevo pedido manual</h1>
      </div>

      {/* Datos del cliente */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <p className="text-sm font-semibold text-gray-900">Datos del cliente</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nombre completo *</label>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={inputCls} placeholder="María López" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Teléfono</label>
            <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className={inputCls} placeholder="55 1234 5678" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Correo</label>
            <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className={inputCls} placeholder="cliente@correo.com" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Dirección / Entrega</label>
            <input value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className={inputCls} placeholder="Calle, colonia, ciudad" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Fecha de entrega</label>
            <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className={inputCls} />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Notas internas</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={inputCls + " resize-none"} placeholder="Ej. pedido por WhatsApp, entregar el sábado…" />
        </div>
      </div>

      {/* Agregar producto del catálogo */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <p className="text-sm font-semibold text-gray-900">Agregar productos</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs text-gray-500 mb-1 block">Producto del catálogo</label>
            <select
              value={selectedProduct?.id ?? ""}
              onChange={(e) => handleSelectProduct(e.target.value)}
              className={inputCls}
            >
              <option value="">— Selecciona un producto —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {fmt(p.price_promo && p.price_promo < p.price ? p.price_promo : p.price)}</option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <>
              {selectedProduct.aromas && selectedProduct.aromas.length > 0 && (
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Aroma</label>
                  <select value={addAroma} onChange={(e) => setAddAroma(e.target.value)} className={inputCls}>
                    {selectedProduct.aromas.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              )}
              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Tamaño / Kit</label>
                  <select value={addSize} onChange={(e) => setAddSize(e.target.value)} className={inputCls}>
                    {selectedProduct.sizes.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {fmt(getUnitPrice(selectedProduct, s.id))}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Cantidad</label>
                <input type="number" min={1} value={addQty} onChange={(e) => setAddQty(parseInt(e.target.value) || 1)} className={inputCls} />
              </div>
              <div className="flex items-end">
                <button onClick={addFromCatalog} className="w-full btn-gold py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5">
                  <Plus size={15} /> Agregar al pedido
                </button>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-gray-50 pt-3">
          {!showCustom ? (
            <button onClick={() => setShowCustom(true)} className="text-xs text-[#C9A84C] hover:underline flex items-center gap-1">
              <Plus size={13} /> Agregar producto personalizado (no está en catálogo)
            </button>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-3 sm:col-span-1">
                <label className="text-xs text-gray-500 mb-1 block">Descripción</label>
                <input value={customName} onChange={(e) => setCustomName(e.target.value)} className={inputCls} placeholder="Ej. Vela decorativa especial" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Precio unitario</label>
                <input type="number" min={0} step={0.01} value={customPrice} onChange={(e) => setCustomPrice(e.target.value)} className={inputCls} placeholder="0.00" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Cantidad</label>
                <input type="number" min={1} value={customQty} onChange={(e) => setCustomQty(parseInt(e.target.value) || 1)} className={inputCls} />
              </div>
              <div className="col-span-3 flex gap-2">
                <button onClick={addCustomItem} className="btn-gold px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5">
                  <Plus size={15} /> Agregar
                </button>
                <button onClick={() => setShowCustom(false)} className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-gray-700 border border-gray-200">
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabla de items */}
      {items.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-900">Resumen del pedido</p>
          </div>
          <div className="divide-y divide-gray-50">
            {items.map((item) => (
              <div key={item.key} className="px-5 py-3 flex items-center gap-3">
                <Package size={14} className="text-gray-300 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  {(item.aroma || item.size) && (
                    <p className="text-xs text-gray-400">{[item.aroma, item.size].filter(Boolean).join(" · ")}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => updateQty(item.key, item.quantity - 1)} className="w-6 h-6 rounded-full border border-gray-200 text-xs text-gray-500 hover:border-[#C9A84C] flex items-center justify-center">−</button>
                  <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                  <button onClick={() => updateQty(item.key, item.quantity + 1)} className="w-6 h-6 rounded-full border border-gray-200 text-xs text-gray-500 hover:border-[#C9A84C] flex items-center justify-center">+</button>
                </div>
                <span className="text-sm font-semibold text-gray-700 w-20 text-right flex-shrink-0">{fmt(item.unitPrice * item.quantity)}</span>
                <button onClick={() => removeItem(item.key)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-gray-50 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Total</span>
            <span className="text-xl font-bold text-[#C9A84C]">{fmt(total)}</span>
          </div>
        </div>
      )}

      {/* Guardar */}
      <div className="flex gap-3 pb-8">
        <button onClick={handleSave} disabled={saving || items.length === 0 || !customerName.trim()}
          className="btn-gold px-8 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50">
          {saving ? <><Loader2 size={16} className="animate-spin" /> Guardando…</> : "Guardar pedido"}
        </button>
        <Link href="/admin/pedidos" className="px-6 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 hover:text-gray-700 font-medium">
          Cancelar
        </Link>
      </div>
    </div>
  );
}

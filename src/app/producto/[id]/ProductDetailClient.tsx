"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DbProduct, DbColor } from "@/lib/products";
import { useCart, EventDetails } from "@/context/CartContext";
import { useToast } from "@/components/Toast";
import { ShoppingCart, ArrowLeft, Check, ChevronLeft, ChevronRight } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import Watermark from "@/components/Watermark";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23F9F0E6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23C9A84C' font-size='120'%3E%F0%9F%95%AF%EF%B8%8F%3C/text%3E%3C/svg%3E";

export default function ProductDetailClient({
  product,
  ribbonColors = [],
  cardColors = [],
}: {
  product: DbProduct;
  ribbonColors?: DbColor[];
  cardColors?: DbColor[];
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const { toast } = useToast();

  const allImages = (() => {
    const imgs = product.images ?? [];
    if (product.image_url && !imgs.includes(product.image_url)) return [product.image_url, ...imgs];
    return imgs.length > 0 ? imgs : [product.image_url ?? ""];
  })();

  // Si todas las variantes son kits/paquetes, agregamos "Pieza individual" al precio base
  const sizes = (() => {
    const list = product.sizes ?? [];
    if (list.length > 0 && list.every((s) => s.isPackage)) {
      return [{ id: "individual", name: "Pieza individual", priceModifier: 0, isPackage: false }, ...list];
    }
    return list;
  })();

  const [activeImg, setActiveImg] = useState(0);
  const [selectedAroma, setSelectedAroma] = useState(product.aromas?.[0] ?? "");
  const [selectedSize, setSelectedSize] = useState(sizes[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isEvento = product.category === "eventos";
  const [ribbonColor, setRibbonColor] = useState(ribbonColors[0]?.label ?? "");
  const [cardColor, setCardColor] = useState(cardColors[0]?.label ?? "");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [phrase, setPhrase] = useState("");

  const minEventDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split("T")[0];
  })();

  const eventDetails: EventDetails | undefined = isEvento
    ? { ribbonColor, cardColor, eventName, eventDate, phrase }
    : undefined;

  const selectedSizeObj = sizes?.find((s) => s.id === selectedSize);
  const sizeModifier = selectedSizeObj?.priceModifier ?? 0;
  const basePrice = product.price_promo && product.price_promo < product.price
    ? product.price_promo
    : product.price;
  const unitPrice = selectedSizeObj?.isPackage ? sizeModifier : basePrice + sizeModifier;
  const hasPromo = !selectedSizeObj?.isPackage && !!product.price_promo && product.price_promo < product.price;
  const discount = hasPromo ? Math.round((1 - product.price_promo! / product.price) * 100) : 0;
  const fmt = (p: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(p);

  const handleAddToCart = () => {
    addItem({
      product: { id: product.id, name: product.name, description: product.description, price: product.price, category: product.category as never, image: allImages[0] ?? "", stock: product.stock },
      quantity,
      selectedAroma: selectedAroma || undefined,
      selectedSize: sizes?.find((s) => s.id === selectedSize)?.name,
      unitPrice,
      eventDetails,
    });
    setAdded(true);
    toast(`${product.name} agregado al carrito`);
    setTimeout(() => setAdded(false), 2000);
  };

  const whatsappText = encodeURIComponent(
    `Hola! Me interesa:\n*${product.name}*\n${selectedAroma ? `Aroma: ${selectedAroma}\n` : ""}${selectedSize ? `Tamaño: ${sizes?.find((s) => s.id === selectedSize)?.name}\n` : ""}${isEvento ? `Listón: ${ribbonColor}\nTarjeta: ${cardColor}\n${eventName ? `Evento: ${eventName}\n` : ""}${eventDate ? `Fecha: ${eventDate}\n` : ""}${phrase ? `Frase: ${phrase}\n` : ""}` : ""}Cantidad: ${quantity}\nPrecio: ${fmt(unitPrice * quantity)}`
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-[#2C1810]/60 hover:text-[#C9A84C] transition-colors mb-8">
        <ArrowLeft size={16} /> Volver
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Galería */}
        <div className="space-y-3">
          {/* Imagen principal */}
          <div
            className="relative aspect-square rounded-3xl overflow-hidden bg-[#F9F0E6] group"
            onContextMenu={(e) => e.preventDefault()}
          >
            <Image
              src={allImages[activeImg] || PLACEHOLDER}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-200 pointer-events-none select-none"
              unoptimized={!allImages[activeImg]}
              draggable={false}
            />
            <Watermark />
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg((i) => (i - 1 + allImages.length) % allImages.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setActiveImg((i) => (i + 1) % allImages.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={18} />
                </button>
                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {allImages.map((_, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === activeImg ? "bg-[#C9A84C] w-4" : "bg-white/70"}`} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allImages.map((url, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? "border-[#C9A84C]" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  <div className="relative w-full h-full" onContextMenu={(e) => e.preventDefault()}>
                    <Image src={url || PLACEHOLDER} alt={`Foto ${i + 1}`} fill className="object-cover pointer-events-none select-none" unoptimized={!url} draggable={false} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detalle */}
        <div className="flex flex-col">
          <p className="text-[#C9A84C] text-xs font-bold tracking-widest uppercase mb-2">{product.category}</p>
          <h1 className="text-3xl font-bold text-[#2C1810] mb-3">{product.name}</h1>
          <p className="text-[#2C1810]/70 leading-relaxed mb-6">{product.description}</p>

          {(product.width_cm || product.height_cm) && (
            <p className="text-sm text-[#2C1810]/60 mb-6">
              📏 Medidas: <span className="font-medium text-[#2C1810]">{product.width_cm ?? "?"} cm (ancho) × {product.height_cm ?? "?"} cm (alto)</span>
            </p>
          )}

          <div className="flex items-baseline gap-3 mb-6 flex-wrap">
            <p className={`text-3xl font-bold ${hasPromo ? "text-red-500" : "text-[#C9A84C]"}`}>
              {fmt(unitPrice)}
            </p>
            {hasPromo && (
              <>
                <p className="text-xl text-[#2C1810]/40 line-through font-medium">
                  {fmt(product.price + (selectedSizeObj?.isPackage ? 0 : sizeModifier))}
                </p>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
                  -{discount}% OFF
                </span>
              </>
            )}
          </div>

          {product.aromas && product.aromas.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-[#2C1810] mb-2">Aroma</p>
              <div className="flex flex-wrap gap-2">
                {product.aromas.map((aroma) => (
                  <button key={aroma} onClick={() => setSelectedAroma(aroma)}
                    className={`px-4 py-1.5 rounded-full text-sm border transition-all ${selectedAroma === aroma ? "btn-gold border-transparent" : "border-[#C9A84C]/50 text-[#2C1810]/70 hover:border-[#C9A84C]"}`}>
                    {aroma}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizes && sizes.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-[#2C1810] mb-2">Tamaño</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button key={size.id} onClick={() => setSelectedSize(size.id)}
                    className={`px-4 py-1.5 rounded-full text-sm border transition-all ${selectedSize === size.id ? "btn-gold border-transparent" : "border-[#C9A84C]/50 text-[#2C1810]/70 hover:border-[#C9A84C]"}`}>
                    {size.name} {size.isPackage ? fmt(size.priceModifier) : size.priceModifier > 0 ? `+${fmt(size.priceModifier)}` : ""}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isEvento && (
            <div className="mb-5 p-4 rounded-2xl border border-[#E8C97A]/40 bg-[#FAF7F2] space-y-4">
              <p className="text-sm font-bold text-[#2C1810]">Personaliza para tu evento 🎉</p>

              {ribbonColors.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-[#2C1810] mb-2">Color de listón</p>
                  <div className="flex flex-wrap gap-2">
                    {ribbonColors.map((c) => (
                      <button key={c.id} type="button" onClick={() => setRibbonColor(c.label)}
                        title={c.label}
                        className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${ribbonColor === c.label ? "border-[#C9A84C] scale-110" : "border-transparent"}`}>
                        <span className="w-7 h-7 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                      </button>
                    ))}
                  </div>
                  {ribbonColor && <p className="text-xs text-[#2C1810]/50 mt-1">Seleccionado: {ribbonColor}</p>}
                </div>
              )}

              {cardColors.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-[#2C1810] mb-2">Color de tarjeta</p>
                  <div className="flex flex-wrap gap-2">
                    {cardColors.map((c) => (
                      <button key={c.id} type="button" onClick={() => setCardColor(c.label)}
                        title={c.label}
                        className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${cardColor === c.label ? "border-[#C9A84C] scale-110" : "border-transparent"}`}>
                        <span className="w-7 h-7 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                      </button>
                    ))}
                  </div>
                  {cardColor && <p className="text-xs text-[#2C1810]/50 mt-1">Seleccionado: {cardColor}</p>}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-[#2C1810] mb-1.5 block">Evento</label>
                  <input value={eventName} onChange={(e) => setEventName(e.target.value)}
                    placeholder="Ej. Mi bautizo"
                    className="w-full border border-[#E8C97A]/60 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C] bg-white" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#2C1810] mb-1.5 block">Fecha del evento</label>
                  <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)}
                    min={minEventDate}
                    className="w-full border border-[#E8C97A]/60 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C] bg-white" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-[#2C1810] mb-1.5 block">Frase para la tarjeta (opcional)</label>
                <textarea value={phrase} onChange={(e) => setPhrase(e.target.value)} rows={2}
                  placeholder="Ej. Gracias por acompañarnos en este día tan especial"
                  className="w-full border border-[#E8C97A]/60 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C] bg-white resize-none" />
              </div>
            </div>
          )}

          <div className="mb-6">
            <p className="text-sm font-semibold text-[#2C1810] mb-2">Cantidad</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn w-9 h-9 rounded-full border border-[#C9A84C] text-[#C9A84C] font-bold hover:bg-[#C9A84C] hover:text-white">−</button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="qty-btn w-9 h-9 rounded-full border border-[#C9A84C] text-[#C9A84C] font-bold hover:bg-[#C9A84C] hover:text-white">+</button>
              <span className="text-xs text-[#2C1810]/50">{product.stock} disponibles</span>
            </div>
          </div>

          <p className="text-sm text-[#2C1810]/60 mb-4">Total: <span className="font-bold text-[#2C1810]">{fmt(unitPrice * quantity)}</span></p>

          <div className="flex flex-col gap-3">
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              className="btn-gold py-3.5 rounded-full flex items-center justify-center gap-2 disabled:opacity-50">
              {added ? <><Check size={18} /> Agregado al carrito</> : <><ShoppingCart size={18} /> Agregar al carrito</>}
            </button>
            <a href={`https://wa.me/5215563442525?text=${whatsappText}`} target="_blank" rel="noopener noreferrer"
              className="py-3.5 rounded-full border-2 border-[#C9A84C] text-[#C9A84C] font-semibold flex items-center justify-center gap-2 hover:bg-[#C9A84C] hover:text-white transition-all">
              <WhatsAppIcon size={18} /> Pedir por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

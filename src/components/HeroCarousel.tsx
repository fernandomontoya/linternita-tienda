"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DbProduct } from "@/lib/products";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23F9F0E6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23C9A84C' font-size='120'%3E%F0%9F%95%AF%EF%B8%8F%3C/text%3E%3C/svg%3E";

export default function HeroCarousel({ products }: { products: DbProduct[] }) {
  const [index, setIndex] = useState(0);

  const goTo = useCallback((i: number) => {
    setIndex((prev) => {
      const len = products.length || 1;
      return (i + len) % len;
    });
  }, [products.length]);

  useEffect(() => {
    if (products.length <= 1) return;
    const id = setInterval(() => goTo(index + 1), 6000);
    return () => clearInterval(id);
  }, [index, products.length, goTo]);

  const product = products[index];
  const img = product?.images?.[0] || product?.image_url || PLACEHOLDER;

  return (
    <div className="relative w-full max-w-sm md:max-w-none group">
      <Link href={product ? `/producto/${product.id}` : "/catalogo"} className="relative block">
        {/* Mancha de fondo */}
        <div className="absolute inset-0 -m-8 rounded-[40%_60%_60%_40%/40%_40%_60%_60%] bg-gradient-to-br from-[#F2C4CE]/30 to-[#E8C97A]/20" />
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            key={product?.id ?? "placeholder"}
            src={img}
            alt={product?.name ?? "Vela artesanal Linternita"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03] animate-[fadeIn_0.4s_ease]"
            priority
            unoptimized={!product?.image_url && !product?.images?.[0]}
          />
        </div>
        {/* Chip flotante */}
        {product && (
          <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-3 shadow-lg border border-[#E8C97A]/30 transition-transform duration-200 group-hover:-translate-y-0.5">
            <p className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-widest">Más vendido</p>
            <p className="text-sm font-semibold text-[#2C1810] mt-0.5">{product.name}</p>
            <p className="text-sm font-bold text-[#C9A84C]">
              ${Number(product.price).toLocaleString("es-MX")}
            </p>
          </div>
        )}
      </Link>

      {products.length > 1 && (
        <>
          <button
            onClick={() => goTo(index - 1)}
            aria-label="Producto anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#2C1810]/70 hover:text-[#C9A84C] transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => goTo(index + 1)}
            aria-label="Siguiente producto"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#2C1810]/70 hover:text-[#C9A84C] transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={16} />
          </button>

          <div className="absolute -bottom-4 right-2 flex gap-1.5">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ver producto ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-[#C9A84C]" : "w-1.5 bg-white/80 border border-[#E8C97A]/60"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

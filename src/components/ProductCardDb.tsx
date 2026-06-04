"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { DbProduct } from "@/lib/products";
import { categories } from "@/data/products";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23F9F0E6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23C9A84C' font-size='60'%3E%F0%9F%95%AF%EF%B8%8F%3C/text%3E%3C/svg%3E";

export default function ProductCardDb({ product }: { product: DbProduct }) {
  const price = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(product.price);

  const imgSrc = product.images?.[0] || product.image_url || PLACEHOLDER;

  return (
    <Link href={`/producto/${product.id}`} className="group block product-grid-item">
      <div className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8C97A]/20">

        {/* Imagen */}
        <div className="relative aspect-square bg-[#F9F0E6] overflow-hidden">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-cover product-img"
            unoptimized={!product.image_url && !product.images?.[0]}
          />

          {/* Badges */}
          {product.stock === 0 ? (
            <span className="absolute top-3 left-3 bg-gray-400/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
              Agotado
            </span>
          ) : product.stock <= 5 ? (
            <span className="absolute top-3 left-3 bg-[#D4889A]/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
              Pocas piezas
            </span>
          ) : null}

          {/* Botón carrito — aparece en hover */}
          <div
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full btn-gold flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
            style={{ transition: "opacity 200ms ease, transform 200ms cubic-bezier(0.23, 1, 0.32, 1)" }}
          >
            <ShoppingCart size={15} />
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-semibold mb-1">
            {categories.find((c) => c.id === product.category)?.label ?? product.category}
          </p>
          <h3 className="font-semibold text-[#2C1810] mb-1 line-clamp-1 text-[15px]">
            {product.name}
          </h3>
          <p className="text-xs text-[#2C1810]/55 line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-[#2C1810]">{price}</span>
            <span className="text-xs text-[#2C1810]/40 font-medium">
              {product.aromas?.length ? `${product.aromas.length} aromas` : product.sizes?.length ? `${product.sizes.length} tamaños` : ""}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

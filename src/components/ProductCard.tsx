"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/data/products";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const formattedPrice = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <Link href={`/producto/${product.id}`} className="group block">
      <div className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8C97A]/20">
        <div className="relative aspect-square bg-[#F9F0E6] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23F9F0E6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23C9A84C' font-size='60'%3E🕯️%3C/text%3E%3C/svg%3E";
            }}
          />
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-3 left-3 bg-[#D4889A] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Pocas piezas
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-3 left-3 bg-gray-400 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Agotado
            </span>
          )}
        </div>

        <div className="p-4">
          <p className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-semibold mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-[#2C1810] mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-xs text-[#2C1810]/60 line-clamp-2 mb-3">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[#C9A84C]">{formattedPrice}</span>
            <div className="w-8 h-8 rounded-full btn-gold flex items-center justify-center">
              <ShoppingCart size={14} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

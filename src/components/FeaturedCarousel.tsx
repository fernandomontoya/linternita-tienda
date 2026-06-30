"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCardDb from "@/components/ProductCardDb";
import { DbProduct, DbCategory } from "@/lib/products";

export default function FeaturedCarousel({
  products,
  categories,
}: {
  products: DbProduct[];
  categories: DbCategory[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(4);

  useEffect(() => {
    const updatePerPage = () => {
      if (window.innerWidth < 640) setPerPage(2);
      else if (window.innerWidth < 1024) setPerPage(3);
      else setPerPage(4);
    };
    updatePerPage();
    window.addEventListener("resize", updatePerPage);
    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  const pageCount = Math.max(1, Math.ceil(products.length / perPage));

  const scrollToPage = useCallback((p: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = (p + pageCount) % pageCount;
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
    setPage(clamped);
  }, [pageCount]);

  // Autoplay
  useEffect(() => {
    if (pageCount <= 1) return;
    const id = setInterval(() => scrollToPage(page + 1), 5000);
    return () => clearInterval(id);
  }, [page, pageCount, scrollToPage]);

  // Sincronizar el dot activo cuando el usuario hace scroll manual (swipe)
  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const newPage = Math.round(track.scrollLeft / track.clientWidth);
    if (newPage !== page) setPage(newPage);
  };

  if (products.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {Array.from({ length: pageCount }).map((_, i) => (
          <div key={i} className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0 w-full snap-start">
            {products.slice(i * perPage, i * perPage + perPage).map((product) => (
              <ProductCardDb
                key={product.id}
                product={product}
                categoryLabel={categories.find((c) => c.id === product.category)?.label}
              />
            ))}
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <>
          <button
            onClick={() => scrollToPage(page - 1)}
            aria-label="Anterior"
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-[#E8C97A]/30 items-center justify-center text-[#2C1810]/70 hover:text-[#C9A84C] transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollToPage(page + 1)}
            aria-label="Siguiente"
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-[#E8C97A]/30 items-center justify-center text-[#2C1810]/70 hover:text-[#C9A84C] transition-colors"
          >
            <ChevronRight size={18} />
          </button>

          <div className="flex justify-center gap-1.5 mt-6">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToPage(i)}
                aria-label={`Ir a la página ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === page ? "w-6 bg-[#C9A84C]" : "w-1.5 bg-[#E8C97A]/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

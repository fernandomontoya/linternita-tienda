"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Watermark from "@/components/Watermark";

export default function ImageLightbox({
  images,
  activeIndex,
  alt,
  onClose,
  onNavigate,
}: {
  images: string[];
  activeIndex: number;
  alt: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate((activeIndex - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onNavigate((activeIndex + 1) % images.length);
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, images.length, onClose, onNavigate]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
      onContextMenu={(e) => e.preventDefault()}
    >
      {images.length > 1 && (
        <p className="absolute top-4 left-4 text-white/70 text-sm font-medium">
          {activeIndex + 1} / {images.length}
        </p>
      )}

      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <X size={20} />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate((activeIndex - 1 + images.length) % images.length); }}
            aria-label="Anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate((activeIndex + 1) % images.length); }}
            aria-label="Siguiente"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <div
        className="relative w-full h-full max-w-4xl max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[activeIndex]}
          alt={alt}
          fill
          className="object-contain select-none"
          draggable={false}
          sizes="100vw"
        />
        <Watermark size={48} position="bottom-left" />
      </div>
    </div>
  );
}

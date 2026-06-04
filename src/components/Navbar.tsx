"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function Navbar() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#E8C97A]/30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Linternita Velas Artesanales" width={44} height={44} className="rounded-full" />
          <div className="hidden sm:block">
            <p className="text-sm font-bold tracking-widest uppercase text-[#C9A84C] leading-none">Linternita</p>
            <p className="text-[10px] tracking-widest uppercase text-[#8B6914]/70 leading-none">Velas Artesanales</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#2C1810]/80">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">Inicio</Link>
          <Link href="/catalogo" className="hover:text-[#C9A84C] transition-colors">Catálogo</Link>
          <Link href="/nosotros" className="hover:text-[#C9A84C] transition-colors">Nosotros</Link>
          <Link href="/contacto" className="hover:text-[#C9A84C] transition-colors">Contacto</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/carrito" className="relative p-2 hover:text-[#C9A84C] transition-colors">
            <ShoppingCart size={22} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#C9A84C] text-white text-[10px] font-bold flex items-center justify-center">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[#E8C97A]/30 bg-[#FAF7F2] px-4 py-4 flex flex-col gap-4 text-sm font-medium">
          <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-[#C9A84C] transition-colors">Inicio</Link>
          <Link href="/catalogo" onClick={() => setMenuOpen(false)} className="hover:text-[#C9A84C] transition-colors">Catálogo</Link>
          <Link href="/nosotros" onClick={() => setMenuOpen(false)} className="hover:text-[#C9A84C] transition-colors">Nosotros</Link>
          <Link href="/contacto" onClick={() => setMenuOpen(false)} className="hover:text-[#C9A84C] transition-colors">Contacto</Link>
        </div>
      )}
    </header>
  );
}

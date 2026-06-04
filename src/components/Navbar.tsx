"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/catalogo", label: "Catálogo" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/contacto", label: "Contacto" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#E8C97A]/30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Linternita Velas Artesanales"
            width={44}
            height={44}
            className="rounded-full"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-bold tracking-widest uppercase text-[#C9A84C] leading-none">Linternita</p>
            <p className="text-[10px] tracking-widest uppercase text-[#8B6914]/70 leading-none mt-0.5">Velas Artesanales</p>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#2C1810]/80">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link hover:text-[#C9A84C] ${pathname === href ? "text-[#C9A84C]" : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          <Link
            href="/carrito"
            className="relative p-2 rounded-xl hover:bg-[#E8C97A]/15 transition-colors duration-150"
          >
            <ShoppingCart size={22} className="text-[#2C1810]/80" />
            {count > 0 && (
              <span
                key={count}
                className="cart-badge absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#C9A84C] text-white text-[10px] font-bold flex items-center justify-center"
              >
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>

          <button
            className="md:hidden p-2 rounded-xl hover:bg-[#E8C97A]/15 transition-colors duration-150"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <span
              className="block transition-transform duration-200"
              style={{ transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)" }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </span>
          </button>
        </div>
      </div>

      {/* Menú mobile */}
      <div
        className={`md:hidden border-t border-[#E8C97A]/30 bg-[#FAF7F2] overflow-hidden transition-all duration-250`}
        style={{
          maxHeight: menuOpen ? "240px" : "0px",
          opacity: menuOpen ? 1 : 0,
          transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <div className="px-4 py-4 flex flex-col gap-1">
          {links.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
                pathname === href
                  ? "bg-[#E8C97A]/20 text-[#C9A84C]"
                  : "text-[#2C1810]/80 hover:bg-[#E8C97A]/10 hover:text-[#C9A84C]"
              }`}
              style={{
                transitionDelay: menuOpen ? `${i * 40}ms` : "0ms",
                transform: menuOpen ? "translateX(0)" : "translateX(-8px)",
                opacity: menuOpen ? 1 : 0,
                transition: `transform 250ms cubic-bezier(0.23, 1, 0.32, 1), opacity 200ms ease`,
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

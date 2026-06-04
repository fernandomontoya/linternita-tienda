import Link from "next/link";
import { Camera } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#2C1810] text-[#FAF7F2] mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="text-[#C9A84C] font-bold tracking-widest uppercase mb-2">Linternita</p>
          <p className="text-xs tracking-widest uppercase text-[#E8C97A]/60 mb-4">Velas Artesanales</p>
          <p className="text-sm text-[#FAF7F2]/70 leading-relaxed">
            Velas hechas con amor, cera de soya y los mejores aromas. Cada pieza es única.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#C9A84C] mb-4">Tienda</p>
          <ul className="space-y-2 text-sm text-[#FAF7F2]/70">
            <li><Link href="/catalogo" className="hover:text-[#C9A84C] transition-colors">Catálogo completo</Link></li>
            <li><Link href="/catalogo?categoria=regalo" className="hover:text-[#C9A84C] transition-colors">Sets de regalo</Link></li>
            <li><Link href="/catalogo?categoria=navidad" className="hover:text-[#C9A84C] transition-colors">Edición navideña</Link></li>
            <li><Link href="/contacto" className="hover:text-[#C9A84C] transition-colors">Pedidos especiales</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#C9A84C] mb-4">Contacto</p>
          <ul className="space-y-2 text-sm text-[#FAF7F2]/70">
            <li>
              <a
                href="https://wa.me/5215563442525"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C9A84C] transition-colors"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/velasartesanales.linternita/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C9A84C] transition-colors flex items-center gap-1"
              >
                📷 @velasartesanales.linternita
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#FAF7F2]/10 py-4 text-center text-xs text-[#FAF7F2]/40">
        © {new Date().getFullYear()} Linternita Velas Artesanales · Hecho con amor en México
      </div>
    </footer>
  );
}

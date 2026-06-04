import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#2C1810] text-[#FAF7F2] mt-20">
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8">

        {/* Top: logo + nav + contacto */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-10 pb-10 border-b border-white/10">

          {/* Marca */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="Linternita" width={40} height={40} className="rounded-full opacity-90" />
              <div>
                <p className="text-[#C9A84C] font-bold tracking-widest uppercase text-sm leading-none">Linternita</p>
                <p className="text-[10px] tracking-widest uppercase text-white/40 leading-none mt-0.5">Velas Artesanales</p>
              </div>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Velas hechas a mano en México con cera de soya, mechas de algodón y aceites esenciales puros.
            </p>
            <a
              href="https://www.instagram.com/velasartesanales.linternita/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-xs text-white/40 hover:text-[#C9A84C] transition-colors"
            >
              📷 @velasartesanales.linternita
            </a>
          </div>

          {/* Tienda */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Tienda</p>
            <ul className="space-y-2.5">
              {[
                { href: "/catalogo", label: "Todo el catálogo" },
                { href: "/catalogo?categoria=regalo", label: "Sets de regalo" },
                { href: "/catalogo?categoria=relajacion", label: "Relajación" },
                { href: "/catalogo?categoria=navidad", label: "Navidad" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/60 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Contacto</p>
            <ul className="space-y-2.5">
              <li>
                <a href="https://wa.me/5215563442525" target="_blank" rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5">
                  WhatsApp
                </a>
              </li>
              <li>
                <Link href="/contacto" className="text-sm text-white/60 hover:text-white transition-colors">
                  Formulario de contacto
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-sm text-white/60 hover:text-white transition-colors">
                  Nuestra historia
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/25">
          <p>© {new Date().getFullYear()} Linternita Velas Artesanales</p>
          <p>Hecho con amor en México 🇲🇽</p>
        </div>
      </div>
    </footer>
  );
}

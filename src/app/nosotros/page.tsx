import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Leaf, Star } from "lucide-react";

export default function NosotrosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <p className="text-[#C9A84C] text-xs font-bold tracking-[0.3em] uppercase mb-3">Nuestra Historia</p>
        <h1 className="text-4xl font-bold text-[#2C1810] mb-4">Detrás de cada llama</h1>
        <p className="text-[#2C1810]/70 max-w-xl mx-auto leading-relaxed">
          Linternita nació de la pasión por crear ambientes especiales. Cada vela que hacemos lleva
          un poco de nuestra alma y el deseo de iluminar tus momentos más queridos.
        </p>
      </div>

      <div className="flex justify-center mb-16">
        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#F2C4CE]/40 to-[#E8C97A]/30 flex items-center justify-center">
          <Image src="/logo.png" alt="Linternita" width={140} height={140} className="object-contain" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {[
          { icon: Leaf, title: "Ingredientes naturales", desc: "Usamos exclusivamente cera de soya 100% natural y aceites esenciales de la más alta pureza." },
          { icon: Heart, title: "Hecho con amor", desc: "Cada vela se elabora a mano, con atención al detalle y cariño en cada paso del proceso." },
          { icon: Star, title: "Diseños únicos", desc: "Creamos piezas irrepetibles: desde las clásicas aromáticas hasta las geódicas de lujo." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="text-center bg-white rounded-2xl p-8 shadow-sm border border-[#E8C97A]/20">
            <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
              <Icon size={20} className="text-white" />
            </div>
            <h3 className="font-bold text-[#2C1810] mb-2">{title}</h3>
            <p className="text-sm text-[#2C1810]/60 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#2C1810] rounded-3xl p-10 text-center text-white">
        <p className="text-[#C9A84C] text-xs font-bold tracking-widest uppercase mb-3">¿Quieres saber más?</p>
        <h2 className="text-2xl font-bold mb-3">Síguenos en Instagram</h2>
        <p className="text-white/70 mb-6">
          Compartimos el proceso artesanal, nuevos diseños y promociones exclusivas en nuestras redes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://www.instagram.com/velasartesanales.linternita/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-8 py-3 rounded-full inline-flex items-center justify-center gap-2"
          >
            @velasartesanales.linternita <ArrowRight size={16} />
          </a>
          <Link href="/catalogo" className="px-8 py-3 rounded-full border-2 border-[#C9A84C] text-[#C9A84C] font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#C9A84C] hover:text-white transition-all">
            Ver catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}

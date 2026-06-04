import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/products";
import { categories } from "@/data/products";
import ProductCardDb from "@/components/ProductCardDb";
import { ArrowRight, Flame, Leaf, Heart, Gift } from "lucide-react";

const features = [
  { icon: Leaf, title: "Cera de Soya", desc: "100% natural, limpia y sostenible" },
  { icon: Flame, title: "Aromas Naturales", desc: "Aceites esenciales de la más alta calidad" },
  { icon: Heart, title: "Hecho a Mano", desc: "Cada vela elaborada con dedicación y amor" },
  { icon: Gift, title: "Ideal para Regalar", desc: "Sets personalizados para cada ocasión" },
];

export default async function Home() {
  const featuredProducts = await getProducts({ featured: true });

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FAF7F2] via-[#F9F0E6] to-[#F2E8D5]">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-[#C9A84C] blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-[#F2C4CE] blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center py-20">
          <div>
            <p className="hero-text text-[#C9A84C] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              ✦ Velas Artesanales ✦
            </p>
            <h1 className="hero-text hero-text-delay-1 text-5xl md:text-6xl font-bold text-[#2C1810] leading-tight mb-6">
              Ilumina tu hogar con{" "}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #C9A84C, #E8C97A)" }}>
                aromas únicos
              </span>
            </h1>
            <p className="hero-text hero-text-delay-2 text-[#2C1810]/70 text-lg mb-8 leading-relaxed">
              Velas hechas con amor, cera de soya y los mejores aceites esenciales.
              Cada pieza es única, elaborada artesanalmente en México.
            </p>
            <div className="hero-text hero-text-delay-3 flex flex-wrap gap-4">
              <Link href="/catalogo" className="btn-gold px-8 py-3.5 rounded-full inline-flex items-center gap-2">
                Ver catálogo <ArrowRight size={16} />
              </Link>
              <a
                href="https://wa.me/5215563442525?text=Hola!%20Me%20interesan%20sus%20velas"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-full border-2 border-[#C9A84C] text-[#C9A84C] font-semibold hover:bg-[#C9A84C] hover:text-white transition-colors duration-200 inline-flex items-center gap-2"
              >
                Escribir por WhatsApp
              </a>
            </div>
          </div>

          <div className="hero-img relative flex justify-center">
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-[#F2C4CE]/40 to-[#E8C97A]/30 flex items-center justify-center">
              <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-gradient-to-br from-[#F9F0E6] to-white shadow-2xl flex items-center justify-center overflow-hidden">
                <Image src="/logo.png" alt="Linternita" width={220} height={220} className="object-contain p-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center p-6">
              <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
                <Icon size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-[#2C1810] mb-1">{title}</h3>
              <p className="text-xs text-[#2C1810]/60">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-[#C9A84C] text-xs font-bold tracking-[0.3em] uppercase mb-2">Explora</p>
          <h2 className="text-3xl font-bold text-[#2C1810]">Nuestras Categorías</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/catalogo?categoria=${cat.id}`}
              className="px-6 py-2.5 rounded-full border border-[#C9A84C] text-[#C9A84C] font-medium text-sm hover:bg-[#C9A84C] hover:text-white transition-all">
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="pb-20 max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-[#C9A84C] text-xs font-bold tracking-[0.3em] uppercase mb-2">Lo más amado</p>
          <h2 className="text-3xl font-bold text-[#2C1810]">Productos Destacados</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCardDb key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/catalogo" className="btn-gold px-8 py-3 rounded-full inline-flex items-center gap-2">
            Ver todo el catálogo <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#2C1810] py-16 text-center">
        <p className="text-[#C9A84C] text-xs font-bold tracking-[0.3em] uppercase mb-3">Pedidos especiales</p>
        <h2 className="text-3xl font-bold text-white mb-4">¿Buscas algo personalizado?</h2>
        <p className="text-white/70 mb-8 max-w-md mx-auto">
          Creamos velas con aromas, colores y envases a tu medida. Perfectas para bodas, eventos o regalos corporativos.
        </p>
        <a href="https://wa.me/5215563442525?text=Hola!%20Quisiera%20un%20pedido%20personalizado"
          target="_blank" rel="noopener noreferrer"
          className="btn-gold px-8 py-3.5 rounded-full inline-flex items-center gap-2">
          Cotizar por WhatsApp <ArrowRight size={16} />
        </a>
      </section>
    </>
  );
}

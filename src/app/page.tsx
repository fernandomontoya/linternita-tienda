import Link from "next/link";
import Image from "next/image";
import { getProducts, getCategories } from "@/lib/products";
import ProductCardDb from "@/components/ProductCardDb";
import { ArrowRight, MessageCircle } from "lucide-react";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23F9F0E6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23C9A84C' font-size='120'%3E%F0%9F%95%AF%EF%B8%8F%3C/text%3E%3C/svg%3E";

export default async function Home() {
  const [featuredProducts, categories] = await Promise.all([
    getProducts({ featured: true }),
    getCategories(),
  ]);
  const heroProduct = featuredProducts[0];
  const heroImg = heroProduct?.images?.[0] || heroProduct?.image_url || PLACEHOLDER;

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#FAF7F2]">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 min-h-[88vh] items-center gap-8 py-16">

          {/* Texto */}
          <div className="order-2 md:order-1">
            <p className="hero-text text-[#C9A84C] text-xs font-bold tracking-[0.3em] uppercase mb-5">
              Hecho a mano en México
            </p>
            <h1 className="hero-text hero-text-delay-1 text-5xl md:text-[3.75rem] font-bold text-[#2C1810] leading-[1.08] mb-6 tracking-tight">
              Velas que llenan tu hogar de{" "}
              <span className="text-[#C9A84C]">aroma y calma</span>
            </h1>
            <p className="hero-text hero-text-delay-2 text-[#2C1810]/60 text-lg mb-10 leading-relaxed max-w-md">
              Las mejores ceras naturales, aceites esenciales puros y mucho cariño en cada pieza. Sin químicos, sin prisa.
            </p>
            <div className="hero-text hero-text-delay-3 flex flex-wrap gap-3">
              <Link
                href="/catalogo"
                className="btn-gold px-7 py-3.5 rounded-full inline-flex items-center gap-2 text-sm font-semibold"
              >
                Ver catálogo <ArrowRight size={15} />
              </Link>
              <a
                href="https://wa.me/5215563442525?text=Hola!%20Me%20interesan%20sus%20velas"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-full border border-[#2C1810]/20 text-[#2C1810]/70 text-sm font-medium hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors duration-200 inline-flex items-center gap-2"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
            </div>

            {/* Prueba social mínima */}
            <div className="hero-text hero-text-delay-4 mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {["🌸","🕯️","✨"].map((e, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-[#F9F0E6] border-2 border-white flex items-center justify-center text-sm">{e}</div>
                ))}
              </div>
              <p className="text-xs text-[#2C1810]/50">
                +200 pedidos entregados con amor
              </p>
            </div>
          </div>

          {/* Imagen del producto hero */}
          <div className="hero-img order-1 md:order-2 relative flex justify-center md:justify-end">
            <Link href={heroProduct ? `/producto/${heroProduct.id}` : "/catalogo"} className="relative w-full max-w-sm md:max-w-none group block">
              {/* Mancha de fondo */}
              <div className="absolute inset-0 -m-8 rounded-[40%_60%_60%_40%/40%_40%_60%_60%] bg-gradient-to-br from-[#F2C4CE]/30 to-[#E8C97A]/20" />
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={heroImg}
                  alt={heroProduct?.name ?? "Vela artesanal Linternita"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  priority
                  unoptimized={!heroProduct?.image_url && !heroProduct?.images?.[0]}
                />
              </div>
              {/* Chip flotante */}
              {heroProduct && (
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-3 shadow-lg border border-[#E8C97A]/30 transition-transform duration-200 group-hover:-translate-y-0.5">
                  <p className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-widest">Más vendido</p>
                  <p className="text-sm font-semibold text-[#2C1810] mt-0.5">{heroProduct.name}</p>
                  <p className="text-sm font-bold text-[#C9A84C]">
                    ${Number(heroProduct.price).toLocaleString("es-MX")}
                  </p>
                </div>
              )}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Franja artesanal ── */}
      <section className="border-y border-[#E8C97A]/30 bg-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-[#2C1810]/70 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Cada vela es elaborada a mano, una por una. Usamos ceras naturales de la mejor calidad,
            mechas de algodón y aceites esenciales puros. Sin parafina, sin colorantes sintéticos.
            <span className="text-[#C9A84C] font-semibold"> Eso se huele.</span>
          </p>
          <div className="flex justify-center gap-8 mt-6 text-center">
            {[
              ["100%", "Ceras naturales"],
              ["0", "Parafina"],
              ["+30", "Aromas únicos"],
            ].map(([num, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold text-[#C9A84C]">{num}</p>
                <p className="text-xs text-[#2C1810]/50 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categorías ── */}
      <section className="py-14 max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-[#2C1810]">Explora por tipo</h2>
          <Link href="/catalogo" className="text-sm text-[#C9A84C] hover:underline font-medium flex items-center gap-1">
            Ver todo <ArrowRight size={13} />
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalogo?categoria=${cat.id}`}
              className="px-5 py-2 rounded-full border border-[#E8C97A]/60 text-[#2C1810]/70 font-medium text-sm hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors duration-150 bg-white"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Productos destacados ── */}
      <section className="pb-20 max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-[#C9A84C] text-xs font-bold tracking-[0.3em] uppercase mb-1">Los favoritos</p>
            <h2 className="text-2xl font-bold text-[#2C1810]">Productos Destacados</h2>
          </div>
          <Link href="/catalogo" className="text-sm text-[#C9A84C] hover:underline font-medium flex items-center gap-1">
            Ver todo el catálogo <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCardDb
                key={product.id}
                product={product}
                categoryLabel={categories.find((c) => c.id === product.category)?.label}
              />
          ))}
        </div>
      </section>

      {/* ── CTA personalizado ── */}
      <section className="bg-[#2C1810] py-16">
        <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[#C9A84C] text-xs font-bold tracking-[0.3em] uppercase mb-3">Para ocasiones especiales</p>
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              ¿Quieres algo hecho para ti?
            </h2>
            <p className="text-white/60 leading-relaxed">
              Bodas, XV años, regalos corporativos o simplemente porque quieres algo único.
              Hacemos velas con tus colores, tus aromas y tu mensaje.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href="https://wa.me/5215563442525?text=Hola!%20Quisiera%20un%20pedido%20personalizado"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold px-7 py-4 rounded-2xl flex items-center justify-center gap-2 font-semibold"
            >
              <MessageCircle size={18} /> Cotizar por WhatsApp
            </a>
            <Link
              href="/contacto"
              className="px-7 py-4 rounded-2xl border border-white/20 text-white/70 font-medium flex items-center justify-center gap-2 hover:border-white/40 hover:text-white transition-colors duration-200 text-sm"
            >
              Ver más opciones
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

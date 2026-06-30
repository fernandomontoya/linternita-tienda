import { Mail } from "lucide-react";

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function InstagramIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

export default function ContactoPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-[#C9A84C] text-xs font-bold tracking-[0.3em] uppercase mb-3">Estamos aquí</p>
        <h1 className="text-4xl font-bold text-[#2C1810] mb-3">Contáctanos</h1>
        <p className="text-[#2C1810]/60">Pedidos especiales, preguntas o simplemente dinos hola 🕯️</p>
      </div>

      <div className="space-y-4 mb-12">
        <a
          href="https://wa.me/5215563442525?text=Hola!%20Quisiera%20más%20información%20sobre%20sus%20velas"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-[#E8C97A]/20 shadow-sm hover:border-[#C9A84C]/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
            <WhatsAppIcon size={22} />
          </div>
          <div>
            <p className="font-semibold text-[#2C1810]">WhatsApp</p>
            <p className="text-sm text-[#2C1810]/60">Respuesta rápida — escríbenos directo</p>
          </div>
        </a>

        <a
          href="https://www.instagram.com/velasartesanales.linternita/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-[#E8C97A]/20 shadow-sm hover:border-[#C9A84C]/50 transition-all"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 flex-shrink-0"
            style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}>
            <span className="text-white"><InstagramIcon size={20} /></span>
          </div>
          <div>
            <p className="font-semibold text-[#2C1810]">Instagram</p>
            <p className="text-sm text-[#2C1810]/60">@velasartesanales.linternita</p>
          </div>
        </a>

        <a
          href="mailto:contacto@linternita.com.mx"
          className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-[#E8C97A]/20 shadow-sm hover:border-[#C9A84C]/50 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-500">
            <Mail size={22} />
          </div>
          <div>
            <p className="font-semibold text-[#2C1810]">Correo</p>
            <p className="text-sm text-[#2C1810]/60">contacto@linternita.com.mx</p>
          </div>
        </a>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-2xl p-8 border border-[#E8C97A]/20 shadow-sm">
        <h2 className="font-bold text-[#2C1810] mb-6">Envíanos un mensaje</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#2C1810]/70 mb-1 block">Nombre</label>
              <input type="text" placeholder="Tu nombre" className="w-full border border-[#E8C97A]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#2C1810]/70 mb-1 block">Correo</label>
              <input type="email" placeholder="tu@correo.com" className="w-full border border-[#E8C97A]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#2C1810]/70 mb-1 block">Mensaje</label>
            <textarea rows={4} placeholder="¿En qué podemos ayudarte?" className="w-full border border-[#E8C97A]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] resize-none" />
          </div>
          <button type="submit" className="btn-gold w-full py-3.5 rounded-xl font-semibold">
            Enviar mensaje
          </button>
        </form>
      </div>
    </div>
  );
}

import { Camera, MessageCircle, Mail } from "lucide-react";

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
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <MessageCircle size={22} className="text-green-600" />
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
          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">📷</span>
          </div>
          <div>
            <p className="font-semibold text-[#2C1810]">Instagram</p>
            <p className="text-sm text-[#2C1810]/60">@velasartesanales.linternita</p>
          </div>
        </a>

        <a
          href="mailto:linternita@gmail.com"
          className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-[#E8C97A]/20 shadow-sm hover:border-[#C9A84C]/50 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Mail size={22} className="text-blue-500" />
          </div>
          <div>
            <p className="font-semibold text-[#2C1810]">Correo</p>
            <p className="text-sm text-[#2C1810]/60">linternita@gmail.com</p>
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

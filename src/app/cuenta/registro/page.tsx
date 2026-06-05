"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: nombre } },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-[#2C1810] mb-2">¡Cuenta creada!</h2>
          <p className="text-sm text-[#2C1810]/60 mb-6">
            Te enviamos un correo de confirmación a <strong>{email}</strong>. Confírmalo para activar tu cuenta.
          </p>
          <Link href="/cuenta/login" className="btn-gold px-8 py-3 rounded-full inline-block font-semibold">
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/logo.png" alt="Linternita" width={56} height={56} className="rounded-full mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-[#2C1810]">Crear cuenta</h1>
          <p className="text-sm text-[#2C1810]/50 mt-1">Guarda tus pedidos y datos de envío</p>
        </div>

        <form onSubmit={handleRegister} className="bg-white rounded-2xl border border-[#E8C97A]/20 shadow-sm p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-[#2C1810]/70 block mb-1.5">Nombre completo</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required
              placeholder="Tu nombre"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10" />
          </div>
          <div>
            <label className="text-xs font-medium text-[#2C1810]/70 block mb-1.5">Correo electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              placeholder="tu@correo.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10" />
          </div>
          <div>
            <label className="text-xs font-medium text-[#2C1810]/70 block mb-1.5">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              placeholder="Mínimo 6 caracteres"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10" />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-xs px-3 py-2.5 rounded-xl">
              <AlertCircle size={12} /> {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="btn-gold w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold disabled:opacity-50">
            {loading ? <><Loader2 size={15} className="animate-spin" /> Creando cuenta...</> : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center text-sm text-[#2C1810]/50 mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link href="/cuenta/login" className="text-[#C9A84C] font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Correo o contraseña incorrectos");
      setLoading(false);
      return;
    }
    router.push("/cuenta/pedidos");
    router.refresh();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/logo.png" alt="Linternita" width={56} height={56} className="rounded-full mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-[#2C1810]">Iniciar sesión</h1>
          <p className="text-sm text-[#2C1810]/50 mt-1">Accede a tus pedidos y más</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl border border-[#E8C97A]/20 shadow-sm p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-[#2C1810]/70 block mb-1.5">Correo electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              placeholder="tu@correo.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10" />
          </div>
          <div>
            <label className="text-xs font-medium text-[#2C1810]/70 block mb-1.5">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10" />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-xs px-3 py-2.5 rounded-xl">
              <AlertCircle size={12} /> {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="btn-gold w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold disabled:opacity-50">
            {loading ? <><Loader2 size={15} className="animate-spin" /> Entrando...</> : "Entrar"}
          </button>
        </form>

        <p className="text-center text-sm text-[#2C1810]/50 mt-4">
          ¿No tienes cuenta?{" "}
          <Link href="/cuenta/registro" className="text-[#C9A84C] font-medium hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
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
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Linternita" width={72} height={72} className="mx-auto rounded-full mb-4" />
          <h1 className="text-2xl font-bold text-[#2C1810]">Panel Admin</h1>
          <p className="text-sm text-[#2C1810]/60 mt-1">Linternita Velas Artesanales</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8C97A]/20 space-y-4">
          <div>
            <label className="text-xs font-medium text-[#2C1810]/70 block mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@linternita.com"
              className="w-full border border-[#E8C97A]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#2C1810]/70 block mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-[#E8C97A]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Entrando...</> : "Entrar al panel"}
          </button>
        </form>
      </div>
    </div>
  );
}

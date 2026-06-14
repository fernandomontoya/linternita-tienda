"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10";

export default function DatosForm({
  email,
  fullName,
  phone,
  address,
}: {
  email: string;
  fullName: string;
  phone: string;
  address: string;
}) {
  const [values, setValues] = useState({ fullName, phone, address });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Sesión no válida, vuelve a iniciar sesión");
      setLoading(false);
      return;
    }

    const { error: upsertError } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: values.fullName,
      phone: values.phone,
      address: values.address,
    });

    setLoading(false);
    if (upsertError) {
      setError("No se pudieron guardar los cambios, intenta de nuevo");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E8C97A]/20 shadow-sm p-6 space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-[#2C1810] mb-1.5">Correo</label>
        <input value={email} disabled className={`${inputCls} bg-gray-50 text-gray-400`} />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2C1810] mb-1.5">Nombre completo</label>
        <input
          value={values.fullName}
          onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
          placeholder="Tu nombre completo"
          className={inputCls}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2C1810] mb-1.5">Teléfono</label>
        <input
          value={values.phone}
          onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
          placeholder="10 dígitos"
          className={inputCls}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2C1810] mb-1.5">Dirección</label>
        <textarea
          value={values.address}
          onChange={(e) => setValues((v) => ({ ...v, address: e.target.value }))}
          placeholder="Calle, número, colonia, ciudad, CP"
          rows={3}
          className={`${inputCls} resize-none`}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2.5">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-xl px-4 py-2.5">
          <CheckCircle size={16} /> Datos guardados correctamente
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-gold px-7 py-3 rounded-full inline-flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-60"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        Guardar cambios
      </button>
    </form>
  );
}

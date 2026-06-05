"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10";
const errCls   = "w-full border border-red-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-red-50 focus:border-red-400";

const validators: Record<string, (v: string) => string> = {
  nombre:    (v) => !v.trim() ? "El nombre es requerido" : "",
  apellido:  (v) => !v.trim() ? "El apellido es requerido" : "",
  email:     (v) => !v.trim() ? "El correo es requerido" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Correo inválido" : "",
  telefono:  (v) => !v.trim() ? "El teléfono es requerido" : v.replace(/\D/g, "").length < 10 ? "Mínimo 10 dígitos" : "",
  direccion: (v) => !v.trim() ? "La dirección es requerida" : v.trim().length < 10 ? "Escribe la dirección completa" : "",
  password:  (v) => v.length < 6 ? "Mínimo 6 caracteres" : "",
};

export default function RegistroPage() {
  const refs = {
    nombre:    useRef<HTMLInputElement>(null),
    apellido:  useRef<HTMLInputElement>(null),
    email:     useRef<HTMLInputElement>(null),
    telefono:  useRef<HTMLInputElement>(null),
    direccion: useRef<HTMLTextAreaElement>(null),
    password:  useRef<HTMLInputElement>(null),
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const getValues = () => ({
    nombre:    refs.nombre.current?.value ?? "",
    apellido:  refs.apellido.current?.value ?? "",
    email:     refs.email.current?.value ?? "",
    telefono:  refs.telefono.current?.value ?? "",
    direccion: refs.direccion.current?.value ?? "",
    password:  refs.password.current?.value ?? "",
  });

  const handleBlur = (name: string) => {
    const el = refs[name as keyof typeof refs]?.current;
    const val = el?.value ?? "";
    const err = validators[name]?.(val) ?? "";
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const validateAll = () => {
    const vals = getValues();
    const newErrors: Record<string, string> = {};
    Object.entries(validators).forEach(([k, fn]) => {
      const err = fn(vals[k as keyof typeof vals]);
      if (err) newErrors[k] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    setLoading(true);
    const vals = getValues();
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: vals.email,
      password: vals.password,
      options: {
        data: { full_name: `${vals.nombre} ${vals.apellido}`.trim() },
      },
    });

    if (error) {
      setErrors((prev) => ({ ...prev, email: error.message }));
      setLoading(false);
      return;
    }

    // Guardar datos del perfil
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: `${vals.nombre} ${vals.apellido}`.trim(),
        phone: vals.telefono,
        address: vals.direccion,
      });
    }

    setRegisteredEmail(vals.email);
    setLoading(false);
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
            Confirmamos tu correo a <strong>{registeredEmail}</strong>. Revísalo para activar tu cuenta y poder hacer pedidos.
          </p>
          <Link href="/cuenta/login" className="btn-gold px-8 py-3 rounded-full inline-block font-semibold">
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/logo.png" alt="Linternita" width={56} height={56} className="rounded-full mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-[#2C1810]">Crear cuenta</h1>
          <p className="text-sm text-[#2C1810]/50 mt-1">Tus datos se guardan para agilizar futuros pedidos</p>
        </div>

        <form onSubmit={handleRegister} className="bg-white rounded-2xl border border-[#E8C97A]/20 shadow-sm p-6 space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#2C1810]/70 block mb-1.5">Nombre <span className="text-[#C9A84C]">*</span></label>
              <input ref={refs.nombre} type="text" placeholder="Tu nombre"
                className={errors.nombre ? errCls : inputCls}
                onBlur={() => handleBlur("nombre")} />
              {errors.nombre && <p className="flex items-center gap-1 mt-1 text-xs text-red-500"><AlertCircle size={11} />{errors.nombre}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-[#2C1810]/70 block mb-1.5">Apellido <span className="text-[#C9A84C]">*</span></label>
              <input ref={refs.apellido} type="text" placeholder="Tu apellido"
                className={errors.apellido ? errCls : inputCls}
                onBlur={() => handleBlur("apellido")} />
              {errors.apellido && <p className="flex items-center gap-1 mt-1 text-xs text-red-500"><AlertCircle size={11} />{errors.apellido}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#2C1810]/70 block mb-1.5">Correo electrónico <span className="text-[#C9A84C]">*</span></label>
            <input ref={refs.email} type="email" placeholder="tu@correo.com"
              className={errors.email ? errCls : inputCls}
              onBlur={() => handleBlur("email")} />
            {errors.email && <p className="flex items-center gap-1 mt-1 text-xs text-red-500"><AlertCircle size={11} />{errors.email}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-[#2C1810]/70 block mb-1.5">Teléfono / WhatsApp <span className="text-[#C9A84C]">*</span></label>
            <input ref={refs.telefono} type="tel" placeholder="55 0000 0000"
              className={errors.telefono ? errCls : inputCls}
              onBlur={() => handleBlur("telefono")} />
            {errors.telefono && <p className="flex items-center gap-1 mt-1 text-xs text-red-500"><AlertCircle size={11} />{errors.telefono}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-[#2C1810]/70 block mb-1.5">Dirección de envío <span className="text-[#C9A84C]">*</span></label>
            <textarea ref={refs.direccion} rows={3} placeholder="Calle, número, colonia, ciudad, CP"
              className={`${errors.direccion ? errCls : inputCls} resize-none`}
              onBlur={() => handleBlur("direccion")} />
            {errors.direccion && <p className="flex items-center gap-1 mt-1 text-xs text-red-500"><AlertCircle size={11} />{errors.direccion}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-[#2C1810]/70 block mb-1.5">Contraseña <span className="text-[#C9A84C]">*</span></label>
            <input ref={refs.password} type="password" placeholder="Mínimo 6 caracteres"
              className={errors.password ? errCls : inputCls}
              onBlur={() => handleBlur("password")} />
            {errors.password && <p className="flex items-center gap-1 mt-1 text-xs text-red-500"><AlertCircle size={11} />{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="btn-gold w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold disabled:opacity-50 mt-2">
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

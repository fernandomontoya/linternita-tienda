"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, Package, LayoutDashboard, ExternalLink, ShoppingBag, Tag, Sparkles } from "lucide-react";

export default function AdminNav({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/productos", label: "Productos", icon: Package },
    { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
    { href: "/admin/categorias", label: "Categorías", icon: Tag },
    { href: "/admin/aromas", label: "Aromas", icon: Sparkles },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo + nav */}
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Linternita" width={28} height={28} className="rounded-full" />
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-[#2C1810]">Linternita</span>
              <span className="text-[10px] bg-[#F9F0E6] text-[#8B6914] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wide">Admin</span>
            </div>
          </Link>

          <div className="h-4 w-px bg-gray-200" />

          <nav className="flex gap-0.5">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
                    active
                      ? "bg-[#F9F0E6] text-[#8B6914]"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={13} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ExternalLink size={12} /> Ver tienda
          </a>
          <div className="h-4 w-px bg-gray-200 hidden sm:block" />
          <span className="text-xs text-gray-400 hidden md:block max-w-[160px] truncate">{userEmail}</span>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}

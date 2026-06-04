"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, Package, LayoutDashboard, ExternalLink } from "lucide-react";

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
  ];

  return (
    <header className="bg-[#2C1810] text-white">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Linternita" width={32} height={32} className="rounded-full" />
            <span className="text-sm font-bold text-[#C9A84C]">Admin</span>
          </Link>
          <nav className="flex gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  pathname === href ? "bg-[#C9A84C] text-white" : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={15} /> {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="text-white/50 hover:text-white transition-colors flex items-center gap-1 text-xs">
            <ExternalLink size={13} /> Ver tienda
          </a>
          <span className="text-white/40 text-xs hidden sm:block">{userEmail}</span>
          <button onClick={handleLogout} className="text-white/60 hover:text-red-400 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

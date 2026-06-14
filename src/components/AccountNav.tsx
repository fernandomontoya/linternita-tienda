"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { LogOut, Package, User } from "lucide-react";

export default function AccountNav({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const tabs = [
    { href: "/cuenta/pedidos", label: "Mis pedidos", icon: Package },
    { href: "/cuenta/datos", label: "Mis datos", icon: User },
  ];

  return (
    <div className="mb-8 pb-4 border-b border-[#E8C97A]/30">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-[#2C1810]/60 truncate">{userEmail}</span>
        <button onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-[#2C1810]/40 hover:text-red-400 transition-colors flex-shrink-0">
          <LogOut size={13} /> Cerrar sesión
        </button>
      </div>
      <div className="flex gap-2">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                active ? "btn-gold" : "border border-[#E8C97A]/60 text-[#2C1810]/70 hover:border-[#C9A84C] hover:text-[#C9A84C]"
              }`}
            >
              <Icon size={14} /> {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

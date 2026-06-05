"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, Package } from "lucide-react";

export default function AccountNav({ userEmail }: { userEmail: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8C97A]/30">
      <div className="flex items-center gap-2 text-sm text-[#2C1810]/60">
        <Package size={15} className="text-[#C9A84C]" />
        <span className="hidden sm:inline">{userEmail}</span>
      </div>
      <button onClick={handleLogout}
        className="flex items-center gap-1.5 text-xs text-[#2C1810]/40 hover:text-red-400 transition-colors">
        <LogOut size={13} /> Cerrar sesión
      </button>
    </div>
  );
}

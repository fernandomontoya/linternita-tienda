import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-50/70">
      <AdminNav userEmail={user.email ?? ""} />
      <main className="max-w-6xl mx-auto px-4 py-8 pb-16">{children}</main>
    </div>
  );
}

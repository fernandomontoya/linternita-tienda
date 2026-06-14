import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AccountNav from "@/components/AccountNav";
import DatosForm from "./DatosForm";

export default async function MisDatosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/cuenta/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, address")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <AccountNav userEmail={user.email ?? ""} />

      <h1 className="text-2xl font-bold text-[#2C1810] mb-6">Mis datos</h1>

      <DatosForm
        email={user.email ?? ""}
        fullName={profile?.full_name ?? ""}
        phone={profile?.phone ?? ""}
        address={profile?.address ?? ""}
      />
    </div>
  );
}

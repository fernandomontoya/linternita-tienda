import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Si no está logueado, redirigir al login con retorno
  if (!user) redirect("/cuenta/login?siguiente=/checkout");

  // Cargar perfil del usuario
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, address")
    .eq("id", user.id)
    .single();

  const nameParts = (profile?.full_name ?? "").trim().split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") ?? "";

  return (
    <CheckoutClient
      userEmail={user.email ?? ""}
      defaultValues={{
        nombre: firstName,
        apellido: lastName,
        email: user.email ?? "",
        telefono: profile?.phone ?? "",
        direccion: profile?.address ?? "",
      }}
    />
  );
}

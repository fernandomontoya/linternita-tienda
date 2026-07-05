import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import ReciboClient from "@/app/admin/(protected)/pedidos/[id]/recibo/ReciboClient";

export default async function ReciboPublicoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Requiere sesión de admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [{ data: order }, { data: payments }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).single(),
    supabase.from("payments").select("*").eq("order_id", id).order("paid_at"),
  ]);

  if (!order) notFound();

  return <ReciboClient order={order} payments={payments ?? []} />;
}

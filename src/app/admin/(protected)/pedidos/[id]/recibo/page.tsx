import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ReciboClient from "./ReciboClient";

export default async function ReciboPedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: order }, { data: payments }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).single(),
    supabase.from("payments").select("*").eq("order_id", id).order("paid_at"),
  ]);

  if (!order) notFound();

  return <ReciboClient order={order} payments={payments ?? []} />;
}

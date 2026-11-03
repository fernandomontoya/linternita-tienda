import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ComprobanteClient from "./ComprobanteClient";

export default async function ComprobantePagoPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: payment } = await supabase
    .from("payments")
    .select("*, orders(id, order_number, customer_name, customer_phone, customer_email, total, status, created_at, delivery_date, items, notes)")
    .eq("id", params.id)
    .single();

  if (!payment) redirect("/admin/pedidos");

  const order = payment.orders as Record<string, unknown>;
  const { orders: _orders, ...paymentData } = payment;

  // Calcular el acumulado hasta este pago (pagos anteriores + este)
  const { data: allPayments } = await supabase
    .from("payments")
    .select("id, amount, paid_at, created_at")
    .eq("order_id", order.id as string)
    .order("paid_at", { ascending: true })
    .order("created_at", { ascending: true });

  const payments = allPayments ?? [];

  // Total pagado hasta e incluyendo este pago
  let runningTotal = 0;
  let paymentIndex = 1;
  for (const p of payments) {
    runningTotal += Number(p.amount);
    if (p.id === params.id) {
      paymentIndex = payments.indexOf(p) + 1;
      break;
    }
  }

  return (
    <ComprobanteClient
      payment={paymentData}
      order={order}
      totalPagadoHasta={runningTotal}
      pagoNumero={paymentIndex}
      totalPagos={payments.length}
    />
  );
}

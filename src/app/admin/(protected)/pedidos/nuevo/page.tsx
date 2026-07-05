import { createClient } from "@/lib/supabase/server";
import NuevoPedidoClient from "./NuevoPedidoClient";

export default async function NuevoPedidoPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, price_promo, aromas, sizes, stock, category, image_url")
    .eq("active", true)
    .order("name");

  return <NuevoPedidoClient products={products ?? []} />;
}

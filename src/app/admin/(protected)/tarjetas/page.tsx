import { createClient } from "@/lib/supabase/server";
import ColorCatalogClient from "@/components/admin/ColorCatalogClient";

export default async function TarjetasPage() {
  const supabase = await createClient();
  const { data: colors } = await supabase
    .from("card_colors")
    .select("*")
    .order("sort_order")
    .order("label");

  return (
    <ColorCatalogClient
      table="card_colors"
      title="Colores de tarjeta"
      description="Catálogo de colores de tarjeta para productos de eventos"
      initialColors={colors ?? []}
    />
  );
}

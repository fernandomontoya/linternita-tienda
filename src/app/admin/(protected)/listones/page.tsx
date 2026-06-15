import { createClient } from "@/lib/supabase/server";
import ColorCatalogClient from "@/components/admin/ColorCatalogClient";

export default async function ListonesPage() {
  const supabase = await createClient();
  const { data: colors } = await supabase
    .from("ribbon_colors")
    .select("*")
    .order("sort_order")
    .order("label");

  return (
    <ColorCatalogClient
      table="ribbon_colors"
      title="Colores de listón"
      description="Catálogo de colores de listón para productos de eventos"
      initialColors={colors ?? []}
    />
  );
}

import { createClient } from "@/lib/supabase/server";
import CategoriasClient from "./CategoriasClient";

export default async function CategoriasPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return <CategoriasClient initialCategories={categories ?? []} />;
}

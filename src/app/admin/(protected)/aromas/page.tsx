import { createClient } from "@/lib/supabase/server";
import AromasClient from "./AromasClient";

export default async function AromasPage() {
  const supabase = await createClient();
  const { data: aromas } = await supabase
    .from("aromas")
    .select("*")
    .order("sort_order")
    .order("label");

  return <AromasClient initialAromas={aromas ?? []} />;
}

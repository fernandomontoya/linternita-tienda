import { createClient } from "@/lib/supabase/server";

export interface DbCategory {
  id: string;
  label: string;
  sort_order: number;
}

export interface DbAroma {
  id: string;
  label: string;
  sort_order: number;
}

export interface DbProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  images: string[] | null;
  aromas: string[] | null;
  sizes: { id: string; name: string; priceModifier: number; isPackage?: boolean }[] | null;
  featured: boolean;
  stock: number;
  active: boolean;
  price_promo: number | null;
}

export async function getProducts(filters?: { category?: string; featured?: boolean }) {
  const supabase = await createClient();
  let query = supabase.from("products").select("*").eq("active", true).order("created_at");

  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.featured) query = query.eq("featured", true);

  const { data } = await query;
  return (data ?? []) as DbProduct[];
}

export async function getProduct(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").eq("id", id).eq("active", true).single();
  return data as DbProduct | null;
}

export async function getCategories(): Promise<DbCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, label, sort_order")
    .order("sort_order");
  return (data ?? []) as DbCategory[];
}

export async function getAromas(): Promise<DbAroma[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("aromas")
    .select("id, label, sort_order")
    .order("sort_order")
    .order("label");
  return (data ?? []) as DbAroma[];
}

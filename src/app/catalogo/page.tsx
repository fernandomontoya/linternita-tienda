import { getProducts, getCategories } from "@/lib/products";
import CatalogoClient from "./CatalogoClient";

export default async function CatalogoPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return <CatalogoClient products={products} categories={categories} />;
}

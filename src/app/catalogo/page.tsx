import { getProducts } from "@/lib/products";
import { categories } from "@/data/products";
import CatalogoClient from "./CatalogoClient";

export default async function CatalogoPage() {
  const products = await getProducts();
  return <CatalogoClient products={products} categories={categories} />;
}

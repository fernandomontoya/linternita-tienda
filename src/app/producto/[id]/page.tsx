import { getProduct, getRibbonColors, getCardColors } from "@/lib/products";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const isEvento = product.category === "eventos";
  const [ribbonColors, cardColors] = isEvento
    ? await Promise.all([getRibbonColors(), getCardColors()])
    : [[], []];

  return <ProductDetailClient product={product} ribbonColors={ribbonColors} cardColors={cardColors} />;
}

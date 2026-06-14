import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategories, getAromas } from "@/lib/products";

export default async function NuevoProductoPage() {
  const [categories, aromaCatalog] = await Promise.all([getCategories(), getAromas()]);

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/productos" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={16} /> Volver
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nuevo producto</h1>
        </div>
      </div>
      <ProductForm categories={categories} aromaCatalog={aromaCatalog} />
    </div>
  );
}

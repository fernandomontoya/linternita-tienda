"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DbProduct } from "@/lib/products";
import ProductCardDb from "@/components/ProductCardDb";
import { Suspense } from "react";

interface Props {
  products: DbProduct[];
  categories: { id: string; label: string }[];
}

function CatalogoContent({ products, categories }: Props) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get("categoria") || "todos");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === "todos" || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, search]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-[#C9A84C] text-xs font-bold tracking-[0.3em] uppercase mb-2">Tienda</p>
        <h1 className="text-4xl font-bold text-[#2C1810]">Nuestro Catálogo</h1>
        <p className="text-[#2C1810]/60 mt-2">Velas artesanales hechas con amor en México</p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar velas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md mx-auto block border border-[#E8C97A]/50 rounded-full px-5 py-2.5 text-sm bg-white focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <button
          onClick={() => setActiveCategory("todos")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            activeCategory === "todos" ? "btn-gold" : "border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-white"
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.id ? "btn-gold" : "border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#2C1810]/40">
          <p className="text-5xl mb-4">🕯️</p>
          <p>No encontramos productos con esos filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCardDb
                key={product.id}
                product={product}
                categoryLabel={categories.find((c) => c.id === product.category)?.label}
              />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CatalogoClient(props: Props) {
  return <Suspense><CatalogoContent {...props} /></Suspense>;
}

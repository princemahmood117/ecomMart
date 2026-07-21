"use client";

import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";


export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await api.get("/products", { params: { search, sort, filter } });
      setProducts(res.data.products);
      setMessage(res.data.message ?? "");
    };
    fetchProducts();
  }, [search, sort, filter]);

  // return (
  //   <div className="container max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
  //     <aside className="space-y-6">
  //       <input
  //         placeholder="Search products..."
  //         value={search}
  //         onChange={(e) => setSearch(e.target.value)}
  //         className="w-full border rounded-lg px-3 py-2"
  //       />
  //       <div>
  //         <p className="font-medium mb-2">Sort by</p>
  //         <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full border rounded-lg px-3 py-2">
  //           <option value="">Default</option>
  //           <option value="price_asc">Price: Low to High</option>
  //           <option value="price_desc">Price: High to Low</option>
  //         </select>
  //       </div>
  //       <div>
  //         <p className="font-medium mb-2">Filter</p>
  //         <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full border rounded-lg px-3 py-2">
  //           <option value="all">All</option>
  //           <option value="new">New Listed</option>
  //         </select>
  //       </div>
  //     </aside>

  //     <section className="md:col-span-3">
  //       {message ? (
  //         <p className="text-center text-gray-500 mt-20">{message}</p>
  //       ) : (
  //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  //           {products.map((p) => (
  //             <ProductCard key={p.id} product={p} />
  //           ))}
  //         </div>
  //       )}
  //     </section>
  //   </div>
  // );

return (
  <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-white">
    {/* Hero */}
    <div className="bg-gradient-to-r from-pink-900 via-pink-800 to-rose-800 text-white">
      <div className="container max-w-6xl mx-auto py-20 px-6 md:px-2 md:flex md:justify-between">
        <h1 className="text-5xl font-bold">
          Discover Beauty
        </h1>

        <p className="mt-4 text-pink-100 max-w-xl">
          Explore our latest skincare, makeup, fragrances, and beauty
          essentials curated just for you.
        </p>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-24 h-fit">
        <div className="bg-white rounded-3xl shadow-lg border border-pink-100 p-7">
          <h2 className="text-xl font-bold mb-6">
            Filters
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">
                Search
              </label>

              <input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Sort
              </label>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Default</option>
                <option value="price_asc">
                  Price: Low to High
                </option>
                <option value="price_desc">
                  Price: High to Low
                </option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Filter
              </label>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="all">All Products</option>
                <option value="new">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      {/* Products */}
      <section className="lg:col-span-3">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">
              Products
            </h2>

            <p className="text-gray-500 mt-1">
              {products.length} products found
            </p>
          </div>
        </div>

        {message ? (
          <div className="bg-white rounded-3xl border border-dashed border-pink-200 py-24 text-center shadow-sm">
            <h3 className="text-3xl font-bold text-gray-700">
              No Products Found
            </h3>

            <p className="text-gray-500 mt-3">
              {message}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  </div>
);
}
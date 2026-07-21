"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import EditProductModal from "@/components/EditProductModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";


export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<any>(null);
  const [deleting, setDeleting] = useState<any>(null);

  const fetchProducts = async () => {
    const res = await api.get("/products", { params: { search, sort, filter, page, limit: 10 } });
    setProducts(res.data.products);
    setTotalPages(res.data.pages ?? 1);
  };

  useEffect(() => {
    fetchProducts();
  }, [search, sort, filter, page]);

  const handleDeleteConfirmed = async () => {
    await api.delete(`/products/${deleting.id}`);
    setDeleting(null);
    fetchProducts();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">All Products</h1>

      <div className="flex flex-wrap gap-4">
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          className="border rounded-lg px-3 py-2 flex-1 min-w-[200px]"
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded-lg px-3 py-2">
          <option value="">Default Sort</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border rounded-lg px-3 py-2">
          <option value="all">All</option>
          <option value="new">New Listed</option>
        </select>
      </div>

      <div className="bg-white border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">ID</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Description</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                  </div>
                </td>
                <td className="p-3">{p.name}</td>
                <td className="p-3 text-gray-500">{p.id.slice(0, 8)}</td>
                <td className="p-3">{p.brand}</td>
                <td className="p-3 max-w-[240px] truncate">{p.description}</td>
                <td className="p-3">{p.quantity}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => setEditing(p)} className="text-blue-600 font-medium">Edit</button>
                  <button onClick={() => setDeleting(p)} className="text-red-600 font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-8 h-8 rounded-full text-sm ${p === page ? "bg-brand-pink text-white" : "border"}`}
          >
            {p}
          </button>
        ))}
      </div>

      {editing && (
        <EditProductModal
          product={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); fetchProducts(); }}
        />
      )}

      {deleting && (
        <DeleteConfirmModal
          productName={deleting.name}
          onClose={() => setDeleting(null)}
          onConfirm={handleDeleteConfirmed}
        />
      )}
    </div>
  );
}
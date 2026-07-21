"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";


export default function AddProductPage() {
  const [form, setForm] = useState({ name: "", brand: "", description: "", price: "", quantity: "" });
  const [benefits, setBenefits] = useState<string[]>([""]);
  const [images, setImages] = useState<FileList | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!images || images.length !== 4) {
      setError("Please upload exactly 4 images.");
      return;
    }

    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      benefits.filter(Boolean).forEach((b) => data.append("benefits", b));
      Array.from(images).forEach((f) => data.append("images", f));

      await api.post("/products", data, { headers: { "Content-Type": "multipart/form-data" } });
      router.push("/admin/products");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Add Product</h1>

      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 space-y-4">
        <input placeholder="Product Name" required className="w-full border rounded-lg px-3 py-2"
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Brand Name" required className="w-full border rounded-lg px-3 py-2"
          onChange={(e) => setForm({ ...form, brand: e.target.value })} />
        <textarea placeholder="Description" required className="w-full border rounded-lg px-3 py-2"
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="number" placeholder="Price" required className="w-full border rounded-lg px-3 py-2"
          onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input type="number" placeholder="Quantity" required className="w-full border rounded-lg px-3 py-2"
          onChange={(e) => setForm({ ...form, quantity: e.target.value })} />

        <div className="space-y-2">
          <p className="text-sm font-medium">Benefits</p>
          {benefits.map((b, i) => (
            <input
              key={i}
              placeholder={`Benefit ${i + 1}`}
              value={b}
              className="w-full border rounded-lg px-3 py-2"
              onChange={(e) => {
                const copy = [...benefits];
                copy[i] = e.target.value;
                setBenefits(copy);
              }}
            />
          ))}
          <button type="button" onClick={() => setBenefits([...benefits, ""])} className="text-sm text-brand-pink font-medium">
            + Add benefit
          </button>
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Product Images (exactly 4)</p>
          <input type="file" multiple accept="image/*" required onChange={(e) => setImages(e.target.files)} />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={saving} className="w-full bg-brand-pink text-white py-3 rounded-full font-medium disabled:opacity-60">
          {saving ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
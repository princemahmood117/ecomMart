"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { api } from "@/lib/api";

export default function EditProductModal({
  product,
  onClose,
  onSaved,
}: {
  product: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: product.name,
    brand: product.brand,
    description: product.description,
    price: product.price,
    quantity: product.quantity,
  });
  const [benefits, setBenefits] = useState<string[]>(product.benefits.length ? product.benefits : [""]);
  const [images, setImages] = useState<FileList | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, String(v)));
      benefits.filter(Boolean).forEach((b) => data.append("benefits", b));
      if (images) Array.from(images).forEach((f) => data.append("images", f));

      await api.put(`/products/${product.id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4"
      >
        <h3 className="text-lg font-semibold">Edit Product</h3>

        <input value={form.name} placeholder="Name" className="w-full border rounded-lg px-3 py-2"
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input value={form.brand} placeholder="Brand" className="w-full border rounded-lg px-3 py-2"
          onChange={(e) => setForm({ ...form, brand: e.target.value })} />
        <textarea value={form.description} placeholder="Description" className="w-full border rounded-lg px-3 py-2"
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="flex gap-3">
          <input type="number" value={form.price} placeholder="Price" className="w-full border rounded-lg px-3 py-2"
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          <input type="number" value={form.quantity} placeholder="Quantity" className="w-full border rounded-lg px-3 py-2"
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Benefits</p>
          {benefits.map((b, i) => (
            <input
              key={i}
              value={b}
              className="w-full border rounded-lg px-3 py-2"
              onChange={(e) => {
                const copy = [...benefits];
                copy[i] = e.target.value;
                setBenefits(copy);
              }}
            />
          ))}
          <button
            type="button"
            onClick={() => setBenefits([...benefits, ""])}
            className="text-sm text-brand-pink font-medium"
          >
            + Add benefit
          </button>
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Replace Images (optional, 4 total)</p>
          <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} />
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 border rounded-lg py-2">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 bg-brand-pink text-white rounded-lg py-2 disabled:opacity-60">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
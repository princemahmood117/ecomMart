"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function OrderModal({ product, qty, onClose }: { product: any; qty: number; onClose: () => void }) {
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", location: "" });
  const router = useRouter();

  const handleSubmit = async () => {
    await api.post("/orders", {
      ...form,
      items: [{ productId: product.id, quantity: qty, price: product.price }],
    });
    onClose();
    router.push("/cart");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-md space-y-4"
      >
        <h3 className="text-lg font-semibold">Place Order</h3>
        <p className="text-sm text-gray-500">{product.name} (ID: {product.id})</p>

        <input placeholder="Full Name" className="w-full border rounded-lg px-3 py-2"
          onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input placeholder="Phone Number" className="w-full border rounded-lg px-3 py-2"
          onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Email" className="w-full border rounded-lg px-3 py-2"
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Full Location" className="w-full border rounded-lg px-3 py-2"
          onChange={(e) => setForm({ ...form, location: e.target.value })} />

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border rounded-lg py-2">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 bg-brand-pink text-white rounded-lg py-2">Submit</button>
        </div>
      </motion.div>
    </div>
  );
}
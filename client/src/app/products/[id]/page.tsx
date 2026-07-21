"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import OrderModal from "@/components/OrderModal";


export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [mainImg, setMainImg] = useState("");
  const [qty, setQty] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      setProduct(res.data);
      setMainImg(res.data.images[0]);
    });
  }, [id]);

  if (!product) return null;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <div>
        <div className="relative w-full h-96 rounded-xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={mainImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image src={mainImg} alt={product.name} fill className="object-cover" />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex gap-3 mt-4">
          {product.images.slice(1, 4).map((img: string) => (
            <button key={img} onClick={() => setMainImg(img)} className="relative w-20 h-20 rounded-lg overflow-hidden shadow-md">
              <Image src={img} alt="sub" fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-sm text-gray-500">ID: {product.id}</p>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-sm text-gray-500">Brand: {product.brand}</p>

        <div className="flex items-center gap-4">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 border rounded-full">-</button>
          <span>{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="w-8 h-8 border rounded-full">+</button>
        </div>

        <p className="text-2xl font-bold">${(product.price * qty).toFixed(2)}</p>

        <ul className="list-disc pl-5 text-sm text-gray-600">
          {product.benefits.map((b: string, i: number) => <li key={i}>{b}</li>)}
        </ul>

        <button
          onClick={() => (user ? setShowModal(true) : (window.location.href = "/login"))}
          className="w-full bg-brand-pink text-white py-3 rounded-full font-medium"
        >
          Order Now
        </button>
      </div>

      {showModal && (
        <OrderModal product={product} qty={qty} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import ProductCard from "./ProductCard";


gsap.registerPlugin(ScrollTrigger);

export default function FeaturedProducts({ products }: { products: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll(".product-card");
    if (!cards) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.6,
        scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
      }
    );
  }, [products]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-8">Featured Products</h2>
      <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 5).map((p) => (
          <div key={p.id} className="product-card">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Link href="/products" className="px-6 py-3 bg-brand-pink text-white rounded-full">
          View More
        </Link>
      </div>
    </section>
  );
}
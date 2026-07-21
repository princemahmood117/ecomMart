"use client";

import { useEffect, useState } from "react";


import { api } from "@/lib/api";
import HeroSlider from "@/components/HeroSlider";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    api.get("/products", { params: { limit: 5 } }).then((res) => setProducts(res.data.products));
  }, []);

  return (
    <main>
      <HeroSlider />
      <FeaturedProducts products={products} />
    </main>
  );
}
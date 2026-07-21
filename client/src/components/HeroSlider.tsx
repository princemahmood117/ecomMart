"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

const slides = [
  { id: 1, img: "/slide1.png", title: "New Arrivals" },
  { id: 2, img: "/slide2.png", title: "Best Sellers" },
  { id: 3, img: "/image30.png", title: "Summer Glow" },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    // <div className="relative w-full h-[55vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
    <div className="relative w-full h-[60vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index].id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image src={slides[index].img} alt={slides[index].title} fill className=" object-cover object-center md:object-top lg:object-center" priority />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h1 className="text-white text-4xl md:text-6xl font-bold">{slides[index].title}</h1>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
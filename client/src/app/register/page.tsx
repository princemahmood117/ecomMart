"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";


export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", age: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", { ...form, age: Number(form.age) });
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-[80vh] flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-center">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="Full Name" required className="w-full border rounded-lg px-3 py-2"
            onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <input type="number" placeholder="Age" required className="w-full border rounded-lg px-3 py-2"
            onChange={(e) => setForm({ ...form, age: e.target.value })} />
          <input type="email" placeholder="Email" required className="w-full border rounded-lg px-3 py-2"
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Password" required className="w-full border rounded-lg px-3 py-2"
            onChange={(e) => setForm({ ...form, password: e.target.value })} />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-brand-pink text-white py-3 rounded-full font-medium disabled:opacity-60">
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-pink font-medium">Login</Link>
        </p>
      </div>
    </motion.div>
  );
}
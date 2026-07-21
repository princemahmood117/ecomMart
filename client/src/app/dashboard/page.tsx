"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";

export default function CustomerDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    api.get("/orders/mine", { params: { confirmed: true } }).then((res) => setOrders(res.data));
  }, []);

  const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-2xl font-semibold">Hi, {user?.fullName ?? "there"} 👋</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border rounded-xl p-5">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-semibold">{orders.length}</p>
        </div>
        <div className="border rounded-xl p-5">
          <p className="text-sm text-gray-500">Delivered</p>
          <p className="text-2xl font-semibold">{deliveredCount}</p>
        </div>
        <div className="border rounded-xl p-5">
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-2xl font-semibold">${totalSpent.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Recent Orders</h2>
        <Link href="/my-orders" className="text-brand-pink text-sm font-medium">View all</Link>
      </div>

      <div className="space-y-3">
        {orders.slice(0, 5).map((order) => (
          <div key={order.id} className="flex justify-between items-center border rounded-lg px-4 py-3">
            <p className="text-sm">#{order.id.slice(0, 8)}</p>
            <p className="text-sm text-gray-500">{order.items.length} item(s)</p>
            <p className="text-sm font-medium">${order.totalPrice.toFixed(2)}</p>
            <span className="text-xs text-gray-500">{order.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
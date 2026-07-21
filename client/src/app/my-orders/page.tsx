// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { api } from "@/lib/api";

// const statusColors: Record<string, string> = {
//   PENDING: "bg-yellow-100 text-yellow-700",
//   SHIPPED: "bg-blue-100 text-blue-700",
//   DELIVERED: "bg-green-100 text-green-700",
//   CANCELLED: "bg-red-100 text-red-700",
// };

// export default function MyOrdersPage() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [cancellingId, setCancellingId] = useState<string | null>(null);

//   const fetchOrders = async () => {
//     const res = await api.get("/orders/mine", { params: { confirmed: true } });
//     console.log(res.data);
//     setOrders(res.data);
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const handleCancel = async (id: string) => {
//     setCancellingId(id);
//     try {
//       await api.delete(`/orders/${id}`);
//       setOrders((prev) => prev.filter((o) => o.id !== id));
//     } finally {
//       setCancellingId(null);
//     }
//   };

//   if (orders.length === 0) {
//     return <p className="text-center text-gray-500 py-20">You have no orders yet.</p>;
//   }

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
//       <h1 className="text-2xl font-semibold">My Orders</h1>

//       {orders.map((order) => (
//         <div key={order.id} className="border rounded-xl p-5 space-y-4">
//           <div className="flex justify-between items-center">
//             <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
//             <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
//               {order.status}
//             </span>
//           </div>

//           {order.items.map((item: any) => (
//             <div key={item.id} className="flex items-center gap-4">
//               <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
//                 <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
//               </div>
//               <div className="flex-1">
//                 <p className="font-medium">{item.product.name}</p>
//                 <p className="text-sm text-gray-500">Qty: {item.quantity} · ${item.price.toFixed(2)} each</p>
//               </div>
//             </div>
//           ))}

//           <div className="flex justify-between items-center border-t pt-3">
//             <p className="font-semibold">Total: ${order.totalPrice.toFixed(2)}</p>
//             {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
//               <button
//                 onClick={() => handleCancel(order.id)}
//                 disabled={cancellingId === order.id}
//                 className="text-red-600 border border-red-200 px-4 py-2 rounded-full text-sm font-medium disabled:opacity-60"
//               >
//                 {cancellingId === order.id ? "Cancelling..." : "Cancel Order"}
//               </button>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }





"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Package, Truck, CheckCircle2, XCircle, ShoppingBag } from "lucide-react";
import { api } from "@/lib/api";

const steps = [
  { key: "PENDING", label: "Placed", icon: Package },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
];

function OrderStepper({ status }: { status: string }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 text-[#A32D2D]">
        <XCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Order cancelled</span>
      </div>
    );
  }

  const activeIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const reached = i <= activeIndex;
        const isLast = i === steps.length - 1;

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                  reached
                    ? "bg-[#e8a0bf] border-[#e8a0bf] text-white"
                    : "bg-white border-[#ECE0E3] text-[#B4A6AB]"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[11px] font-medium ${reached ? "text-[#2B1D24]" : "text-[#B4A6AB]"}`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`h-[2px] w-10 sm:w-16 mx-1 -mt-4 rounded-full transition-colors ${
                  i < activeIndex ? "bg-[#e8a0bf]" : "bg-[#ECE0E3]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    const res = await api.get("/orders/mine", { params: { confirmed: true } });
    setOrders(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      await api.delete(`/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return null;

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center px-4 py-24">
        <div className="w-14 h-14 rounded-full bg-[#FBF6F4] flex items-center justify-center mx-auto mb-5">
          <ShoppingBag className="w-6 h-6 text-[#e8a0bf]" />
        </div>
        <h1 className="text-xl font-semibold text-[#2B1D24] mb-2">Nothing here yet</h1>
        <p className="text-sm text-[#8B7378] mb-6">
          Go find something you&apos;ll love — your orders will show up here once you place one.
        </p>
        <Link
          href="/products"
          className="inline-block bg-[#e8a0bf] text-white px-6 py-3 rounded-full text-sm font-medium">
          Browse products
        </Link>
      </div>
    );
  }

  return (
  <div className="container mx-auto px-6 md:px-10 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#2B1D24]">My orders</h1>
        <p className="text-sm text-[#8B7378] mt-1">
          {orders.length} order{orders.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-5">
        <AnimatePresence>
          {orders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="bg-white rounded-2xl border border-[#ECE0E3] p-5 sm:p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#B4A6AB] tracking-wide">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-xs text-[#B4A6AB]">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <OrderStepper status={order.status} />

              <div className="space-y-3 pt-1">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#FBF6F4]">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[#2B1D24] truncate">{item.product.name}</p>
                      <p className="text-xs text-[#8B7378]">
                        Qty {item.quantity} · ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <p className="text-sm font-medium text-[#2B1D24] shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#ECE0E3]">
                <div>
                  <p className="text-xs text-[#8B7378]">Total</p>
                  <p className="text-lg font-semibold text-[#2B1D24]">${order.totalPrice.toFixed(2)}</p>
                </div>

                {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    disabled={cancellingId === order.id}
                    className="text-[#A32D2D] border border-[#F0C4C4] px-4 py-2 rounded-full text-xs font-medium disabled:opacity-60 hover:bg-[#FCEBEB] transition-colors"
                  >
                    {cancellingId === order.id ? "Cancelling…" : "Cancel order"}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
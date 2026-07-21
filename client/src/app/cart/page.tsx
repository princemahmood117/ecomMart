// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { api } from "@/lib/api";

// export default function CartPage() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const fetchCart = async () => {
//     const res = await api.get("/orders/mine", { params: { confirmed: false } });
//     setOrders(res.data);
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const total = orders.reduce((sum, o) => sum + o.totalPrice, 0);

//   const handleConfirm = async () => {
//     setLoading(true);
//     try {
//       await Promise.all(orders.map((o) => api.patch(`/orders/${o.id}/confirm`)));
//       router.push("/my-orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (orders.length === 0) {
//     return <p className="text-center text-gray-500 py-20">Your cart is empty.</p>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
//       <h1 className="text-2xl font-semibold">Your Cart</h1>

//       <div className="space-y-4">
//         {orders.map((order) =>
//           order.items.map((item: any) => (
//             <div key={item.id} className="flex items-center gap-4 border rounded-xl p-4">
//               <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
//                 <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
//               </div>
//               <div className="flex-1">
//                 <p className="font-medium">{item.product.name}</p>
//                 <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//               </div>
//               <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
//             </div>
//           ))
//         )}
//       </div>

//       <div className="flex justify-between items-center border-t pt-4">
//         <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
//         <button
//           onClick={handleConfirm}
//           disabled={loading}
//           className="bg-brand-pink text-white px-8 py-3 rounded-full font-medium disabled:opacity-60"
//         >
//           {loading ? "Placing Order..." : "Confirm Order"}
//         </button>
//       </div>
//     </div>
//   );
// }












"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function CartPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchCart = async () => {
    const res = await api.get("/orders/mine", { params: { confirmed: false } });
    setOrders(res.data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  const handleRemove = async (orderId: string) => {
    setRemovingId(orderId);
    try {
      await api.delete(`/orders/${orderId}`);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } finally {
      setRemovingId(null);
    }
  };

//   const handleConfirm = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       await Promise.all(orders.map((o) => api.patch(`/orders/${o.id}/confirm`)));
//       router.push("/my-orders");
//     } catch (err) {
//       setError("Something went wrong confirming your order. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

const handleConfirm = async () => {
  setLoading(true);
  try {
    await Promise.all(orders.map((o) => api.patch(`/orders/${o.id}/confirm`)));
    setOrders([]); // clear cart immediately, don't wait for remount
    router.push("/my-orders");
    router.refresh(); // bust Next.js router cache so cart re-fetches next time
  } finally {
    setLoading(false);
  }
};

  if (orders.length === 0) {
    return <p className="text-center text-gray-500 py-20">Your cart is empty.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Your Cart</h1>

      <div className="space-y-4">
        {orders.map((order) =>
          order.items.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4 border rounded-xl p-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              <button
                onClick={() => handleRemove(order.id)}
                disabled={removingId === order.id}
                className="text-red-600 text-sm font-medium border border-red-200 rounded-full px-3 py-1.5 disabled:opacity-60"
              >
                {removingId === order.id ? "Removing..." : "Remove"}
              </button>
            </div>
          ))
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-between items-center border-t pt-4">
        <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="bg-brand-pink text-white px-8 py-3 rounded-full font-medium disabled:opacity-60"
        >
          {loading ? "Placing Order..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
}
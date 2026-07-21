// "use client";

// import { api } from "@/lib/api";
// import { useEffect, useState } from "react";


// const statusFlow: Record<string, string> = {
//   PENDING: "SHIPPED",
//   SHIPPED: "DELIVERED",
// };

// const statusLabel: Record<string, string> = {
//   PENDING: "Mark as Shipped",
//   SHIPPED: "Mark as Delivered",
// };

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [updatingId, setUpdatingId] = useState<string | null>(null);

//   const fetchOrders = async () => {
//     const res = await api.get("/orders");
//     setOrders(res.data);
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const handleUpdate = async (id: string, currentStatus: string) => {
//     const next = statusFlow[currentStatus];
//     if (!next) return;
//     setUpdatingId(id);
//     try {
//       await api.patch(`/orders/${id}/status`, { status: next });
//       fetchOrders();
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-semibold">Orders</h1>

//       <div className="bg-white border rounded-xl overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50 text-left">
//             <tr>
//               <th className="p-3">Customer</th>
//               <th className="p-3">Products</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.filter((o) => o.isConfirmed).map((order) => (
//               <tr key={order.id} className="border-t align-top">
//                 <td className="p-3">
//                   <p className="font-medium">{order.fullName}</p>
//                   <p className="text-xs text-gray-500">{order.phone}</p>
//                 </td>
//                 <td className="p-3">
//                   {order.items.map((item: any) => (
//                     <p key={item.id} className="text-xs text-gray-600">
//                       {item.product.name} (x{item.quantity}) — ID: {item.productId.slice(0, 8)}
//                     </p>
//                   ))}
//                 </td>
//                 <td className="p-3">
//                   <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{order.status}</span>
//                 </td>
//                 <td className="p-3">
//                   {statusFlow[order.status] ? (
//                     <button
//                       onClick={() => handleUpdate(order.id, order.status)}
//                       disabled={updatingId === order.id}
//                       className="text-brand-pink font-medium text-xs disabled:opacity-60"
//                     >
//                       {updatingId === order.id ? "Updating..." : statusLabel[order.status]}
//                     </button>
//                   ) : (
//                     <span className="text-xs text-gray-400">—</span>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }







"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";


const statusFlow: Record<string, string> = {
  PENDING: "SHIPPED",
  SHIPPED: "DELIVERED",
};

const statusLabel: Record<string, string> = {
  PENDING: "Mark as Shipped",
  SHIPPED: "Mark as Delivered",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    const res = await api.get("/orders", { params: { search, sort } });
    setOrders(res.data);
  };

  useEffect(() => {
    const timeout = setTimeout(fetchOrders, 300); // debounce search
    return () => clearTimeout(timeout);
  }, [search, sort]);

  const handleUpdate = async (id: string, currentStatus: string) => {
    const next = statusFlow[currentStatus];
    if (!next) return;
    setUpdatingId(id);
    try {
      await api.patch(`/orders/${id}/status`, { status: next });
      fetchOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Order History</h1>

      <div className="flex flex-wrap gap-4">
        <input
          placeholder="Search by phone number or order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 flex-1 min-w-[240px]"
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded-lg px-3 py-2">
          <option value="">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_desc">Total: High to Low</option>
          <option value="price_asc">Total: Low to High</option>
        </select>
      </div>

      <div className="bg-white border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Locatoin</th>
              <th className="p-3">Products</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.filter((o) => o.isConfirmed).map((order) => (
              <tr key={order.id} className="border-t align-top">
                <td className="p-3 text-xs text-gray-500">{order.id.slice(0, 8)}</td>
                <td className="p-3">
                  <p className="font-medium">{order.fullName}</p>
                  <p className="text-xs text-gray-500">Phone: {order.phone}</p>
                </td>
                <td className="p-3">
                  <p className="font-medium">{order.location}</p>                  
                </td>
                <td className="p-3">
                  {order.items.map((item: any) => (
                    <p key={item.id} className="text-xs text-gray-600">
                      {item.product.name} (x{item.quantity})
                    </p>
                  ))}
                </td>
                <td className="p-3 font-medium">${order.totalPrice.toFixed(2)}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3">
                  {statusFlow[order.status] ? (
                    <button
                      onClick={() => handleUpdate(order.id, order.status)}
                      disabled={updatingId === order.id}
                      className="text-brand-pink font-medium text-xs disabled:opacity-60"
                    >
                      {updatingId === order.id ? "Updating..." : statusLabel[order.status]}
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
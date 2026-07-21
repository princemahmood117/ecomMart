// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useState } from "react";
// import { Menu, X, ShoppingCart } from "lucide-react";
// import { useAuthStore } from "@/store/authStore";

// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   const user = useAuthStore((s) => s.user);

//   return (
//     <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
//       <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
//         <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
//           <Image src="/logo.svg" alt="logo" width={32} height={32} />
//           Glow Cosmetics
//         </Link>

//         <div className="hidden md:flex items-center gap-8 text-sm font-medium">
//           <Link href="/products">Products</Link>
//           <Link href="/about">About Us</Link>
//           {!user && <Link href="/login">Login</Link>}
//         </div>

//         <div className="hidden md:flex items-center gap-4">
//           {user && (
//             <>
//               <Link href="/cart"><ShoppingCart className="w-5 h-5" /></Link>
//               <Image src={user.photoUrl} alt="profile" width={36} height={36} className="rounded-full" />
//             </>
//           )}
//         </div>

//         <button className="md:hidden" onClick={() => setOpen(!open)}>
//           {open ? <X /> : <Menu />}
//         </button>
//       </div>

//       {open && (
//         <div className="md:hidden flex flex-col gap-4 px-4 pb-4 text-sm font-medium">
//           <Link href="/products" onClick={() => setOpen(false)}>Products</Link>
//           <Link href="/about" onClick={() => setOpen(false)}>About Us</Link>
//           {!user && <Link href="/login" onClick={() => setOpen(false)}>Login</Link>}
//           {user && <Link href="/cart" onClick={() => setOpen(false)}>Cart</Link>}
//         </div>
//       )}
//     </nav>
//   );
// }














"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  const handleLogout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    setMenuOpen(false);
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <Image src="/logo.svg" alt="logo" width={32} height={32} />
          Hello Mart
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/products">Products</Link>
          <Link href="/about">About Us</Link>
          {!user && <Link href="/login">Login</Link>}
        </div>

        <div className="hidden md:flex items-center gap-4 relative">
          {user && (
            <>
              <Link href="/cart"><ShoppingCart className="w-5 h-5" /></Link>

              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-1"
              >
                <Image
                  src={user?.photoUrl || "../../public/user-logo.png"}
                  alt="profile"
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
                <ChevronDown className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 bg-white border rounded-xl shadow-lg py-2 w-44 text-sm">
                  {user.role === "ADMIN" ? (
                    <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-50">
                      Admin Panel
                    </Link>
                  ) : (
                    <>
                      <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-50">
                        Dashboard
                      </Link>
                      <Link href="/my-orders" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-50">
                        My Orders
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden flex flex-col gap-4 px-4 pb-4 text-sm font-medium">
          <Link href="/products" onClick={() => setOpen(false)}>Products</Link>
          <Link href="/about" onClick={() => setOpen(false)}>About Us</Link>
          {!user && <Link href="/login" onClick={() => setOpen(false)}>Login</Link>}
          {user && (
            <>
              <Link href="/cart" onClick={() => setOpen(false)}>Cart</Link>
              {user.role === "ADMIN" ? (
                <Link href="/admin" onClick={() => setOpen(false)}>Admin Panel</Link>
              ) : (
                <>
                  <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                  <Link href="/my-orders" onClick={() => setOpen(false)}>My Orders</Link>
                </>
              )}
              <button onClick={handleLogout} className="text-left text-red-600">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
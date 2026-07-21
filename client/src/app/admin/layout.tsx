"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, Package, PlusCircle, ClipboardList } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "All Products", icon: Package },
  { href: "/admin/products/add", label: "Add Product", icon: PlusCircle },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user && user.role !== "ADMIN") router.push("/");
  }, [user, router]);

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 border-r bg-white shrink-0 py-8 px-4 space-y-2">
        <p className="text-lg font-semibold px-2 mb-6">Admin Panel</p>
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
              pathname === href ? "bg-brand-pink/10 text-brand-pink" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
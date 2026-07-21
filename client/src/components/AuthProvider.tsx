"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    api.get("/auth/me").then((res) => setUser(res.data)).catch(() => setUser(null));
  }, [setUser]);

  return <>{children}</>;
}
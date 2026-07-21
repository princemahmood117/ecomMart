import { create } from "zustand";

interface User {
  id: string;
  fullName: string;
  role: "CUSTOMER" | "ADMIN";
  photoUrl: string;
}

interface AuthState {
  user: User | null;
  setUser: (u: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
}));
import { create } from "zustand";
import type { User } from "../Clases";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  role: string;
  setRole: (role: string) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      role: "",
      setRole: (role) => set({ role }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, role: state.role }),
    }
  )
);

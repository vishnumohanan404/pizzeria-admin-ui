import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Tenant {
  id: number;
  name: string;
  address: string;
}
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  tenant?: Tenant;
}

interface AuthState {
  user: null | User;
  setUser: (user: User) => void;
  logOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logOut: () => set({ user: null }),
  }))
);

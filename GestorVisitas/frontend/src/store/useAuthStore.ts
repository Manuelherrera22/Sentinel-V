import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  userRole: 'guard' | 'admin' | null;
  token: string | null;
  login: (token: string, role: 'guard' | 'admin') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userRole: null,
  token: null,
  login: (token, role) => set({ isAuthenticated: true, userRole: role, token }),
  logout: () => set({ isAuthenticated: false, userRole: null, token: null }),
}));

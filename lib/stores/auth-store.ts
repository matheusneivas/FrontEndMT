import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, RoleType } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  perfil: RoleType | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      perfil: null,

      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          perfil: user.role,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          perfil: null,
        });
      },

      setUser: (user) => {
        set({
          user,
          perfil: user?.role || null,
          isAuthenticated: !!user,
        });
      },

      setToken: (token) => {
        set({ token });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      owner: null,
      setAuth: (token, owner) => set({ token, owner }),
      logout: () => set({ token: null, owner: null }),
    }),
    {
      name: 'pagorenta-auth',
    }
  )
);

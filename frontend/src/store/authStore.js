import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      owner: null,
      isDemoMode: false,
      setAuth: (token, owner) => set({ token, owner, isDemoMode: false }),
      setDemoMode: (isDemo) => set({
        isDemoMode: isDemo,
        token: isDemo ? 'demo-token' : null,
        owner: isDemo ? { name: 'Usuario Demo', plan: 'pro', email: 'demo@example.com' } : null
      }),
      logout: () => set({ token: null, owner: null, isDemoMode: false }),
    }),
    {
      name: 'pagorenta-auth',
    }
  )
);

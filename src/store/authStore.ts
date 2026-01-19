import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, User } from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        const result = await api.login(email, password);
        
        if (result.error) {
          set({ isLoading: false, error: result.error });
          return false;
        }

        if (result.data) {
          api.setToken(result.data.accessToken);
          set({
            user: result.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        }

        return false;
      },

      register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        
        const result = await api.register(email, password, name);
        
        if (result.error) {
          set({ isLoading: false, error: result.error });
          return false;
        }

        if (result.data) {
          api.setToken(result.data.accessToken);
          set({
            user: result.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        }

        return false;
      },

      logout: () => {
        api.setToken(null);
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: async () => {
        const token = api.getToken();
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });
        const result = await api.getMe();

        if (result.error) {
          api.setToken(null);
          set({ isAuthenticated: false, user: null, isLoading: false });
          return;
        }

        if (result.data) {
          set({
            user: result.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

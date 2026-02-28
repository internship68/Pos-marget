import { create } from 'zustand';
import { supabase } from '../lib/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'cashier';
  name: string;
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  setUser: (user: UserProfile | null) => void;
  login: (email: string, pass: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'เข้าสู่ระบบไม่สำเร็จ');
      }

      const { user, session } = await response.json();

      // Store session in local storage for Supabase client
      if (session) {
        localStorage.setItem('supabase.auth.token', session.access_token);
      }

      set({ user, isLoading: false });
      return user;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      fetch(`${API_URL}/auth/logout`, { method: 'POST' }); // Async call
      localStorage.removeItem('supabase.auth.token');
      set({ user: null, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  checkSession: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('supabase.auth.token');
      if (!token) {
        set({ user: null, isLoading: false });
        return;
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const user = await response.json();
        set({ user, isLoading: false });
      } else {
        localStorage.removeItem('supabase.auth.token');
        set({ user: null, isLoading: false });
      }
    } catch (err: any) {
      set({ user: null, isLoading: false });
    }
  }
}));

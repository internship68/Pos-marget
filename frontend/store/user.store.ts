import { create } from 'zustand';
import { API_URL } from '../lib/services/api';

export interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    role: 'admin' | 'cashier';
    created_at?: string;
}

interface UserState {
    users: UserProfile[];
    isLoading: boolean;
    error: string | null;

    fetchUsers: () => Promise<void>;
    updateUserRole: (id: string, role: 'admin' | 'cashier') => Promise<void>;
    updateUser: (id: string, data: Partial<UserProfile>) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
}



export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    isLoading: false,
    error: null,

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${API_URL}/users`);
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            set({ users: data, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    updateUserRole: async (id, role) => {
        try {
            const response = await fetch(`${API_URL}/users/${id}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role }),
            });
            if (!response.ok) throw new Error('Failed to update role');

            const updatedUser = await response.json();
            set((state) => ({
                users: state.users.map(u => u.id === id ? updatedUser : u)
            }));
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        }
    },

    updateUser: async (id, data) => {
        try {
            const response = await fetch(`${API_URL}/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to update user');

            const updatedUser = await response.json();
            set((state) => ({
                users: state.users.map(u => u.id === id ? updatedUser : u)
            }));
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await fetch(`${API_URL}/users/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete user');

            set((state) => ({
                users: state.users.filter(u => u.id !== id)
            }));
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        }
    }
}));

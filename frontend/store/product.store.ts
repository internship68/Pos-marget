import { create } from 'zustand';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Product {
  id: string;
  name: string;
  barcode: string | null;
  category_id: string | null;
  category: { id: string; name: string } | null;
  cost_price: number;
  selling_price: number;
  stock: number;
  low_stock_alert: number;
  image_url: string | null;
}

export interface Category {
  id: string;
  name: string;
}

interface ProductState {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'category'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Omit<Product, 'category'>>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  adjustStock: (id: string, amount: number) => Promise<void>;
  setStock: (id: string, amount: number) => Promise<void>;

  addCategory: (category: { name: string }) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const products = await res.json();
      set({ products, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      const categories = await res.json();
      set({ categories });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  addProduct: async (product) => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error('Failed to create product');
      const newProduct = await res.json();
      set((state) => ({ products: [newProduct, ...state.products] }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error('Failed to update product');
      const updated = await res.json();
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updated : p)),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  adjustStock: async (id, amount) => {
    const product = get().products.find((p) => p.id === id);
    if (!product) return;
    const newStock = Math.max(0, product.stock + amount);
    await get().updateProduct(id, { stock: newStock });
  },

  setStock: async (id, amount) => {
    await get().updateProduct(id, { stock: Math.max(0, amount) });
  },

  addCategory: async (categoryData) => {
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      if (!res.ok) throw new Error('Failed to create category');
      const newCategory = await res.json();
      set((state) => ({ categories: [...state.categories, newCategory] }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateCategory: async (id, name) => {
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Failed to update category');
      const updated = await res.json();
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? updated : c)),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete category');
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));

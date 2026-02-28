import { create } from 'zustand';
import { ProductService, CategoryService } from '@/lib/services/product.service';
import type { Product, Category } from '@/lib/services/product.service';

export type { Product, Category };

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
      const products = await ProductService.getAll();
      set({ products, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await CategoryService.getAll();
      set({ categories });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  addProduct: async (product) => {
    try {
      const newProduct = await ProductService.create(product);
      set((state) => ({ products: [newProduct, ...state.products] }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const updated = await ProductService.update(id, productData);
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
      await ProductService.delete(id);
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
      const newCategory = await CategoryService.create(categoryData);
      set((state) => ({ categories: [...state.categories, newCategory] }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateCategory: async (id, name) => {
    try {
      const updated = await CategoryService.update(id, { name });
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
      await CategoryService.delete(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));

import { create } from 'zustand';
import { ProductService, Product } from '../lib/services/product.service';

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
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Local state methods (if needed for performance, but should usually sync with DB)
  adjustStock: (id: string, amount: number) => Promise<void>;
  setStock: (id: string, amount: number) => Promise<void>;

  // Category management
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [
    { id: '1', name: 'อาหาร' },
    { id: '2', name: 'เครื่องดื่ม' },
    { id: '3', name: 'ขนม' },
    { id: '4', name: 'ของใช้' },
  ],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const products = await ProductService.getAll();
      set({ products, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addProduct: async (product) => {
    try {
      const newProduct = await ProductService.create(product);
      set((state) => ({ products: [newProduct, ...state.products] }));
    } catch (error: any) {
      set({ error: error.message });
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

  addCategory: (categoryData) => {
    const newCategory: Category = {
      id: Math.random().toString(36).substring(2, 9),
      ...categoryData,
    };
    set((state) => ({ categories: [...state.categories, newCategory] }));
  },

  updateCategory: (id, name) => {
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? { ...c, name } : c)),
    }));
  },

  deleteCategory: (id) => {
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }));
  },
}));

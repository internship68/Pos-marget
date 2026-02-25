import { create } from 'zustand';
import { Product } from './pos.store';

export interface Category {
  id: string;
  name: string;
}

interface ProductState {
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, amount: number) => void;
  setStock: (id: string, amount: number) => void;
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  categories: [
    { id: '1', name: 'เครื่องดื่ม' },
    { id: '2', name: 'อาหาร' },
    { id: '3', name: 'เบเกอรี่' },
    { id: '4', name: 'ของใช้ทั่วไป' },
  ],
  products: [
    { id: '1', name: 'น้ำดื่มสิงห์ 500มล.', barcode: '885012345678', category: 'เครื่องดื่ม', cost_price: 5, selling_price: 10, stock: 120, low_stock_alert: 20, image_url: '' },
    { id: '2', name: 'มาม่าคัพ หมูสับ', barcode: '885098765432', category: 'อาหาร', cost_price: 9.5, selling_price: 15, stock: 5, low_stock_alert: 10, image_url: '' },
    { id: '3', name: 'ทิชชู่ซิลค์ แพ็ค 4', barcode: '885000112233', category: 'ของใช้ทั่วไป', cost_price: 45, selling_price: 69, stock: 0, low_stock_alert: 5, image_url: '' },
    { id: '4', name: 'ข้าวหอมมะลิ 5กก.', barcode: '885022334455', category: 'อาหาร', cost_price: 150, selling_price: 185, stock: 45, low_stock_alert: 10, image_url: '' },
  ],
  addProduct: (product) => set((state) => ({
    products: [{ ...product, id: Date.now().toString() }, ...state.products]
  })),
  updateProduct: (id, product) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...product } : p)
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),
  adjustStock: (id, amount) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + amount) } : p)
  })),
  setStock: (id, amount) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, stock: Math.max(0, amount) } : p)
  })),
  addCategory: (name) => set((state) => ({
    categories: [...state.categories, { id: Date.now().toString(), name }]
  })),
  updateCategory: (id, name) => set((state) => ({
    categories: state.categories.map(c => c.id === id ? { ...c, name } : c)
  })),
  deleteCategory: (id) => set((state) => ({
    categories: state.categories.filter(c => c.id !== id)
  }))
}));

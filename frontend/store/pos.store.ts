import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  barcode: string;
  category: string;
  cost_price: number;
  selling_price: number;
  stock: number;
  low_stock_alert: number;
  image_url: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface PosState {
  cart: CartItem[];
  discount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setDiscount: (discount: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getNetAmount: () => number;
}

export const usePosStore = create<PosState>((set, get) => ({
  cart: [],
  discount: 0,
  addToCart: (product) => set((state) => {
    const existing = state.cart.find(item => item.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    }
    return { cart: [...state.cart, { ...product, quantity: 1 }] };
  }),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.id !== productId)
  })),
  updateQuantity: (productId, quantity) => set((state) => ({
    cart: state.cart.map(item => 
      item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    )
  })),
  setDiscount: (discount) => set({ discount }),
  clearCart: () => set({ cart: [], discount: 0 }),
  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + (item.selling_price * item.quantity), 0);
  },
  getNetAmount: () => {
    const { getCartTotal, discount } = get();
    return Math.max(0, getCartTotal() - discount);
  }
}));

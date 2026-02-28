import { API_URL, apiFetch } from './api';

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

// ===== Products =====
export const ProductService = {
    getAll: () => apiFetch<Product[]>('/products'),

    create: (data: Omit<Product, 'id' | 'category'>) =>
        apiFetch<Product>('/products', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: string, data: Partial<Omit<Product, 'category'>>) =>
        apiFetch<Product>(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id: string) =>
        apiFetch<void>(`/products/${id}`, { method: 'DELETE' }),
};

// ===== Categories =====
export const CategoryService = {
    getAll: () => apiFetch<Category[]>('/categories'),

    create: (data: { name: string }) =>
        apiFetch<Category>('/categories', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: string, data: { name: string }) =>
        apiFetch<Category>(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id: string) =>
        apiFetch<void>(`/categories/${id}`, { method: 'DELETE' }),
};

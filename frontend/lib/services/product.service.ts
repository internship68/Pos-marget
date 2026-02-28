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

export class ProductService {
    private static API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    private static ENDPOINT = `${ProductService.API_URL}/products`;

    static async getAll(): Promise<Product[]> {
        const res = await fetch(this.ENDPOINT);
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
    }

    static async create(product: Omit<Product, 'id'>): Promise<Product> {
        const res = await fetch(this.ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        if (!res.ok) throw new Error('Failed to create product');
        return res.json();
    }

    static async update(id: string, product: Partial<Product>): Promise<Product> {
        const res = await fetch(`${this.ENDPOINT}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        if (!res.ok) throw new Error('Failed to update product');
        return res.json();
    }

    static async delete(id: string): Promise<void> {
        const res = await fetch(`${this.ENDPOINT}/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete product');
    }
}

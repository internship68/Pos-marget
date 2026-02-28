export class CreateProductDto {
    name: string;
    barcode?: string;
    cost_price?: number;
    selling_price: number;
    stock?: number;
    low_stock_alert?: number;
    category_id?: string;
    image_url?: string;
}

export class UpdateProductDto {
    name?: string;
    barcode?: string;
    cost_price?: number;
    selling_price?: number;
    stock?: number;
    low_stock_alert?: number;
    category_id?: string;
    image_url?: string;
}

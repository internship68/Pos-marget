export class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    stock: number;
    category_id?: string;
    image_url?: string;
}

export class UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    category_id?: string;
    image_url?: string;
}

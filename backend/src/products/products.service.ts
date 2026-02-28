import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
    private readonly TABLE_NAME = 'products';

    constructor(private readonly supabaseService: SupabaseService) { }

    private get client() {
        return this.supabaseService.getClient();
    }

    async findAll() {
        const { data, error } = await this.client
            .from(this.TABLE_NAME)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    async findOne(id: string) {
        const { data, error } = await this.client
            .from(this.TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw new NotFoundException(`Product with ID ${id} not found`);
        return data;
    }

    async create(createProductDto: CreateProductDto) {
        const { data, error } = await this.client
            .from(this.TABLE_NAME)
            .insert(createProductDto)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        const { data, error } = await this.client
            .from(this.TABLE_NAME)
            .update(updateProductDto)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async remove(id: string) {
        const { error } = await this.client
            .from(this.TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { deleted: true };
    }
}

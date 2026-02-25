import { supabase } from '@/lib/supabase/client';

export class ProductsService {
  async findAll() {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async create(product: any) {
    const { data, error } = await supabase.from('products').insert(product).select().single();
    if (error) throw error;
    return data;
  }

  async update(id: string, product: any) {
    const { data, error } = await supabase.from('products').update(product).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async remove(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}

export const productsService = new ProductsService();

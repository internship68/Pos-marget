import { supabase } from '@/lib/supabase/client';

export class TransactionsService {
  async findAll() {
    const { data, error } = await supabase.from('transactions').select('*, transaction_items(*)').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await supabase.from('transactions').select('*, transaction_items(*)').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async create(transactionData: any) {
    const { items, ...transaction } = transactionData;
    
    // Start a transaction in Supabase by inserting the main record
    const { data: newTransaction, error: txError } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();
      
    if (txError) throw txError;

    // Insert items
    if (items && items.length > 0) {
      const itemsToInsert = items.map((item: any) => ({
        ...item,
        transaction_id: newTransaction.id
      }));
      
      const { error: itemsError } = await supabase
        .from('transaction_items')
        .insert(itemsToInsert);
        
      if (itemsError) throw itemsError;
      
      // Update stock
      for (const item of items) {
        // Fetch current stock
        const { data: product } = await supabase.from('products').select('stock').eq('id', item.product_id).single();
        if (product) {
          await supabase.from('products').update({ stock: product.stock - item.quantity }).eq('id', item.product_id);
        }
      }
    }

    return newTransaction;
  }
}

export const transactionsService = new TransactionsService();

'use client';

import React, { useState, useEffect } from 'react';
import { usePosStore } from '@/store/pos.store';
import { useProductStore } from '@/store/product.store';
import { useAuthStore } from '@/store/auth.store';
import { Search, Grid, ShoppingCart, Trash2, Minus, Plus, Edit, Banknote, Building, CheckCircle, AlertTriangle, Package, Coffee, Loader2, Receipt } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function PosPage() {
  const { products, categories, fetchProducts, fetchCategories } = useProductStore();
  const { cart, addToCart, removeFromCart, updateQuantity, getCartTotal, getNetAmount, discount, setDiscount, clearCart } = usePosStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'all' || p.category_id === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery));
    return matchCategory && matchSearch;
  });

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    try {
      const saleData = {
        cashier_id: user?.id || null,
        cashier_name: user?.name || 'ไม่ระบุ',
        subtotal: getCartTotal(),
        discount: discount,
        total: getNetAmount(),
        payment_method: paymentMethod,
        items: cart.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: Number(item.selling_price),
          total_price: Number(item.selling_price) * item.quantity,
        })),
      };

      const res = await fetch(`${API_URL}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'ไม่สามารถบันทึกการขายได้');
      }

      const sale = await res.json();
      setShowReceipt(sale);
      clearCart();
      // refresh products เพื่ออัปเดตสต็อก
      fetchProducts();
    } catch (err: any) {
      alert('เกิดข้อผิดพลาด: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden w-full">
      {/* Left Side: Product Selection (65%) */}
      <section className="w-[65%] flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        {/* Search */}
        <div className="p-4 bg-white dark:bg-slate-900/50">
          <div className="relative group">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-lg"
              placeholder="ค้นหาสินค้า หรือ สแกนบาร์โค้ด..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 pb-2 flex gap-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${selectedCategory === 'all' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            <Grid className="w-5 h-5" />
            ทั้งหมด
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${selectedCategory === cat.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              <Package className="w-5 h-5" />
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 content-start no-scrollbar bg-slate-50 dark:bg-slate-900/30">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.stock === 0;
            const isLowStock = product.stock <= product.low_stock_alert && !isOutOfStock;

            return (
              <button
                key={product.id}
                onClick={() => addToCart(product as any)}
                disabled={isOutOfStock}
                className={`group relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm transition-all text-left flex flex-col h-48 ${isOutOfStock ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:shadow-md hover:ring-2 hover:ring-primary'
                  } ${isLowStock ? 'ring-1 ring-red-400 dark:ring-red-500/50' : ''}`}
              >
                {isOutOfStock && (
                  <div className="absolute top-2 right-2 bg-slate-500 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10">สินค้าหมด</div>
                )}
                {isLowStock && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10 flex items-center gap-1 shadow-sm animate-pulse">
                    <AlertTriangle className="w-3 h-3" /> เหลือ {product.stock}
                  </div>
                )}
                <div className="h-28 w-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Coffee className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                  )}
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{product.name}</span>
                  <span className="text-primary font-bold mt-auto text-lg">฿{Number(product.selling_price).toFixed(2)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Right Side: Transaction Summary (35%) */}
      <aside className="w-[35%] flex flex-col bg-white dark:bg-slate-900 shadow-xl z-20">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            รายการสั่งซื้อ
            {cart.length > 0 && (
              <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">{cart.length}</span>
            )}
          </h2>
          <button onClick={clearCart} className="text-slate-500 hover:text-red-500 transition-colors" title="ล้างตะกร้า">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-2">
          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 mt-20">
                <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                <p>ยังไม่มีสินค้าในตะกร้า</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="w-14 h-14 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                    <Coffee className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold line-clamp-1">{item.name}</p>
                    <p className="text-xs text-slate-500">฿{Number(item.selling_price).toFixed(2)} / ชิ้น</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded bg-primary text-white">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="w-20 text-right">
                    <p className="font-bold text-primary">฿{(Number(item.selling_price) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Calculation & Payment */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 space-y-4 bg-slate-50 dark:bg-slate-900/80">
          <div className="space-y-2">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>รวมทั้งหมด ({cart.reduce((s, i) => s + i.quantity, 0)} ชิ้น)</span>
              <span>฿{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span>ส่วนลด</span>
              <div className="flex items-center gap-2">
                <input
                  className="w-20 text-right py-1 px-2 rounded border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-primary"
                  placeholder="0.00"
                  type="number"
                  value={discount || ''}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
                <Edit className="w-4 h-4" />
              </div>
            </div>
            <div className="pt-2 flex justify-between items-center border-t border-dashed border-slate-200 dark:border-slate-700">
              <span className="text-xl font-bold">ยอดสุทธิ</span>
              <span className="text-3xl font-extrabold text-primary">฿{getNetAmount().toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${paymentMethod === 'cash'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5'
                }`}
            >
              <Banknote className="w-8 h-8" />
              <span className="font-bold text-sm">เงินสด</span>
            </button>
            <button
              onClick={() => setPaymentMethod('transfer')}
              className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${paymentMethod === 'transfer'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5'
                }`}
            >
              <Building className="w-8 h-8" />
              <span className="font-bold text-sm">โอนเงิน</span>
            </button>
          </div>

          {/* Final Action */}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              <>
                <CheckCircle className="w-6 h-6" />
                ยืนยันการขาย
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 text-center border-b border-slate-200 dark:border-slate-800 bg-emerald-50 dark:bg-emerald-900/20">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-emerald-700 dark:text-emerald-400">บันทึกการขายสำเร็จ!</h3>
              <p className="text-sm text-slate-500 mt-1">เลขที่บิล: <span className="font-bold text-primary">{showReceipt.receipt_number}</span></p>
            </div>

            <div className="p-6 overflow-y-auto font-mono text-sm space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-black">POS STORE</h2>
                <p className="text-slate-500 text-xs">123 ถนนสุขุมวิท กรุงเทพฯ 10110</p>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">เลขที่:</span><span className="font-bold">{showReceipt.receipt_number}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">วันที่:</span><span>{new Date(showReceipt.created_at).toLocaleString('th-TH')}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">แคชเชียร์:</span><span>{showReceipt.cashier_name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">ชำระโดย:</span><span>{showReceipt.payment_method === 'cash' ? 'เงินสด' : 'โอนเงิน'}</span></div>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 dark:border-slate-700 py-3">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="text-left font-normal pb-2">รายการ</th>
                      <th className="text-right font-normal pb-2">จำนวน</th>
                      <th className="text-right font-normal pb-2">ราคา</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showReceipt.items?.map((item: any) => (
                      <tr key={item.id}>
                        <td className="py-1 pr-2">{item.product_name}</td>
                        <td className="py-1 text-right">{item.quantity}</td>
                        <td className="py-1 text-right">฿{Number(item.total_price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">ยอดรวม</span><span>฿{Number(showReceipt.subtotal).toFixed(2)}</span></div>
                {Number(showReceipt.discount) > 0 && (
                  <div className="flex justify-between text-red-500"><span>ส่วนลด</span><span>-฿{Number(showReceipt.discount).toFixed(2)}</span></div>
                )}
                <div className="flex justify-between font-bold text-base pt-1 border-t border-dashed border-slate-300">
                  <span>ยอดสุทธิ</span>
                  <span className="text-primary">฿{Number(showReceipt.total).toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center text-xs text-slate-500 mt-4">
                <p>ขอบคุณที่ใช้บริการ</p>
                <p>Please come again</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <button
                onClick={() => setShowReceipt(null)}
                className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Receipt className="w-5 h-5" />
                ปิดใบเสร็จ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

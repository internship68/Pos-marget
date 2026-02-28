'use client';

import React, { useState, useEffect } from 'react';
import { useProductStore } from '@/store/product.store';
import { Search, Package, AlertTriangle, Coffee } from 'lucide-react';

export default function CashierStockPage() {
  const { products, categories, fetchProducts, fetchCategories } = useProductStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'all' || p.category_id === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.barcode && p.barcode.includes(searchQuery));
    return matchCategory && matchSearch;
  });

  return (
    <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">สต็อกสินค้า</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">ตรวจสอบจำนวนสินค้าคงเหลือ</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อสินค้า หรือ บาร์โค้ด..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">ทุกหมวดหมู่</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Product List */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">สินค้า</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">หมวดหมู่</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-right">ราคาขาย</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-right">คงเหลือ</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredProducts.map((product) => {
                  const isOutOfStock = product.stock === 0;
                  const isLowStock = product.stock <= product.low_stock_alert && !isOutOfStock;

                  return (
                    <tr key={product.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isLowStock ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <Coffee className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{product.name}</p>
                            <p className="text-xs text-slate-500">{product.barcode ?? '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{product.category?.name ?? '-'}</td>
                      <td className="p-4 text-right font-medium">฿{Number(product.selling_price).toFixed(2)}</td>
                      <td className="p-4 text-right font-bold text-slate-900 dark:text-white">{product.stock}</td>
                      <td className="p-4 text-center">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                            สินค้าหมด
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            <AlertTriangle className="w-3 h-3" />
                            สต็อกต่ำ
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                            ปกติ
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      ไม่พบข้อมูลสินค้า
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useProductStore } from '@/store/product.store';
import { Calendar, Download, TrendingUp, Wallet, Package, AlertTriangle, ShoppingCart } from 'lucide-react';
import { SalesService } from '@/lib/services/sales.service';

export default function DashboardPage() {
  const { products, categories, fetchProducts, fetchCategories } = useProductStore();
  const [salesSummary, setSalesSummary] = useState({ todayRevenue: 0, todayCount: 0, totalRevenue: 0, totalCount: 0 });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    SalesService.getSummary().then(setSalesSummary).catch(() => { });
  }, [fetchProducts, fetchCategories]);

  const lowStockProducts = products.filter(p => p.stock <= p.low_stock_alert);
  const totalProducts = products.length;
  const totalStockValue = products.reduce((sum, p) => sum + (Number(p.cost_price) * p.stock), 0);
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">ภาพรวมระบบ</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">ยินดีต้อนรับกลับมา, นี่คือสถานะปัจจุบันของร้านค้าคุณ</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            วันนี้
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold shadow-lg shadow-primary/25 flex items-center gap-2">
            <Download className="w-4 h-4" />
            ดาวน์โหลดรายงาน
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-6 rounded-xl shadow-lg shadow-primary/20 transition-all hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <span className="text-white/80 text-xs font-bold">ยอดขายวันนี้</span>
          </div>
          <p className="text-white/80 text-sm font-medium">รายได้วันนี้ ({salesSummary.todayCount} บิล)</p>
          <p className="text-2xl font-black mt-1">฿{salesSummary.todayRevenue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Package className="w-6 h-6" />
            </div>
            <span className="text-slate-500 text-xs font-bold">สินค้าทั้งหมด</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">จำนวนสินค้าในระบบ</p>
          <p className="text-2xl font-black mt-1">{totalProducts} <span className="text-base font-normal text-slate-400">รายการ</span></p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              มูลค่าสต็อก
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">มูลค่าสินค้าคงเหลือ (ต้นทุน)</p>
          <p className="text-2xl font-black mt-1">฿{totalStockValue.toLocaleString('th-TH', { minimumFractionDigits: 0 })}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
              <Package className="w-6 h-6" />
            </div>
            <span className="text-amber-500 text-xs font-bold">สินค้าหมด</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">สินค้าที่สต็อกเป็น 0</p>
          <p className="text-2xl font-black mt-1">{outOfStockCount} <span className="text-base font-normal text-slate-400">รายการ</span></p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-rose-500 text-xs font-bold">ต้องเติมด่วน</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">สินค้าสต็อกต่ำ</p>
          <p className="text-2xl font-black mt-1">{lowStockProducts.length} <span className="text-base font-normal text-slate-400">รายการ</span></p>
        </div>
      </div>

      {/* Charts & Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Low Stock Alert Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">สินค้าสต็อกต่ำ</h3>
            <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-full">{lowStockProducts.length} รายการ</span>
          </div>
          {lowStockProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Package className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">สต็อกสินค้าทั้งหมดอยู่ในระดับปกติ ✓</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.slice(0, 8).map(product => (
                <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.category?.name ?? 'ไม่มีหมวดหมู่'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-rose-600">{product.stock} <span className="font-normal text-xs text-slate-400">หน่วย</span></p>
                    <p className="text-[10px] text-slate-400">เกณฑ์: {product.low_stock_alert}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">หมวดหมู่สินค้า</h3>
            <span className="text-xs text-slate-500">{categories.length} หมวดหมู่</span>
          </div>
          <div className="flex-1 space-y-3">
            {categories.map(cat => {
              const count = products.filter(p => p.category_id === cat.id).length;
              const pct = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0;
              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-slate-500">{count} รายการ</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {categories.length === 0 && (
              <p className="text-center text-slate-400 text-sm py-8">ยังไม่มีหมวดหมู่</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

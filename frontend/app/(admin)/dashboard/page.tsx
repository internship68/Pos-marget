'use client';

import React, { useEffect, useState } from 'react';
import { useProductStore } from '@/store/product.store';
import { Calendar, Download, TrendingUp, Wallet, Package, AlertTriangle, ShoppingCart, FileText } from 'lucide-react';
import { SalesService } from '@/lib/services/sales.service';
import type { Sale } from '@/lib/services/sales.service';
import Link from 'next/link';

export default function DashboardPage() {
  const { products, categories, fetchProducts, fetchCategories } = useProductStore();
  const [salesSummary, setSalesSummary] = useState({ todayRevenue: 0, todayCount: 0, totalRevenue: 0, totalCount: 0 });
  const [recentSales, setRecentSales] = useState<Sale[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    SalesService.getSummary().then(setSalesSummary).catch(() => { });
    SalesService.getAll({ status: 'completed' }).then(sales => setRecentSales(sales.slice(0, 5))).catch(() => { });
  }, [fetchProducts, fetchCategories]);

  const lowStockProducts = products.filter(p => p.stock <= p.low_stock_alert);
  const totalProducts = products.length;
  const totalStockValue = products.reduce((sum, p) => sum + (Number(p.cost_price) * p.stock), 0);
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">ภาพรวมระบบ</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">ยินดีต้อนรับกลับมา, นี่คือสถานะปัจจุบันของร้านค้าคุณ</p>
        </div>
        <div className="flex gap-3">
          <Link href="/reports" className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors">
            <Calendar className="w-5 h-5 text-primary" />
            ดูรายงานละเอียด
          </Link>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold shadow-lg shadow-primary/25 flex items-center gap-2 hover:bg-primary/90 transition-all">
            <Download className="w-4 h-4" />
            ดาวน์โหลดสรุป
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-6 rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <span className="text-white/80 text-xs font-bold uppercase tracking-wider">Today</span>
          </div>
          <p className="text-white/80 text-sm font-medium">รายได้วันนี้ ({salesSummary.todayCount})</p>
          <p className="text-3xl font-black mt-1">฿{salesSummary.todayRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Package className="w-6 h-6" />
            </div>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-right">Inventory</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">สินค้าในระบบ</p>
          <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white">{totalProducts}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest text-right">Value</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">มูลค่าสต็อกต้นทุน</p>
          <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white">฿{(totalStockValue / 1000).toFixed(1)}K</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
              <Package className="w-6 h-6" />
            </div>
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest text-right">Empty</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">สินค้าหมด</p>
          <p className="text-3xl font-black mt-1 text-amber-600">{outOfStockCount}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-rose-500 text-[10px] font-black uppercase tracking-widest text-right">Urgent</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">สินค้าสต็อกต่ำ</p>
          <p className="text-3xl font-black mt-1 text-rose-600">{lowStockProducts.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Sales */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                รายการขายล่าสุด
              </h3>
              <Link href="/transactions" className="text-sm font-bold text-primary hover:underline">ดูทั้งหมด</Link>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {recentSales.map(sale => (
                <div key={sale.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{sale.receipt_number}</p>
                      <p className="text-xs text-slate-500">โดย {sale.cashier_name} · {new Date(sale.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900 dark:text-white">฿{Number(sale.total).toLocaleString()}</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase">{sale.payment_method}</p>
                  </div>
                </div>
              ))}
              {recentSales.length === 0 && (
                <div className="p-10 text-center text-slate-400">ยังไม่มีรายการขายวันนี้</div>
              )}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                สินค้าสต็อกต่ำ
              </h3>
              <Link href="/stock" className="text-sm font-bold text-primary hover:underline">จัดการสต็อก</Link>
            </div>
            {lowStockProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                <Package className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-sm">สต็อกสินค้าทั้งหมดอยู่ในระดับปกติ ✓</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lowStockProducts.slice(0, 4).map(product => (
                  <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800 overflow-hidden">
                      {product.image_url ? (
                        <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{product.name}</p>
                      <p className="text-xs text-rose-600 font-bold">คงเหลือ: {product.stock}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col h-fit">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">สัดส่วนหมวดหมู่</h3>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Analytics</span>
          </div>
          <div className="space-y-5">
            {categories.map(cat => {
              const count = products.filter(p => p.category_id === cat.id).length;
              const pct = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0;
              return (
                <div key={cat.id} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-sm font-bold block">{cat.name}</span>
                      <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">{count} รายการ</span>
                    </div>
                    <span className="text-sm font-black text-primary">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000"
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
          <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-xs text-primary font-bold mb-1 uppercase tracking-wider">💡 Insider Tip</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              หมวดหมู่ที่มีสินค้ามากที่สุดคือ <span className="font-bold">อาคารสถานที่</span> ลองพิจารณาจัดโปรโมชั่นเพื่อระบายสต็อก
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

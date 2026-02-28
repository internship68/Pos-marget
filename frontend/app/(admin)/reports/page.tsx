'use client';

import React, { useEffect } from 'react';
import { useProductStore } from '@/store/product.store';
import { BarChart3, Package, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, ShoppingCart, AlertTriangle } from 'lucide-react';

export default function ReportsPage() {
    const { products, categories, fetchProducts, fetchCategories } = useProductStore();

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [fetchProducts, fetchCategories]);

    const totalProducts = products.length;
    const totalStockValue = products.reduce((sum, p) => sum + (Number(p.cost_price) * p.stock), 0);
    const totalSellingValue = products.reduce((sum, p) => sum + (Number(p.selling_price) * p.stock), 0);
    const expectedProfit = totalSellingValue - totalStockValue;
    const lowStockProducts = products.filter(p => p.stock <= p.low_stock_alert);
    const outOfStockProducts = products.filter(p => p.stock === 0);

    // จัดกลุ่มสินค้าตามหมวดหมู่
    const categoryStats = categories.map(cat => {
        const catProducts = products.filter(p => p.category_id === cat.id);
        const stockValue = catProducts.reduce((sum, p) => sum + (Number(p.cost_price) * p.stock), 0);
        const totalStock = catProducts.reduce((sum, p) => sum + p.stock, 0);
        return {
            ...cat,
            productCount: catProducts.length,
            totalStock,
            stockValue,
        };
    });

    // หาสินค้าที่มูลค่าสต็อกสูงสุด
    const topValueProducts = [...products]
        .map(p => ({ ...p, value: Number(p.cost_price) * p.stock }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    return (
        <div className="w-full">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-primary" />
                        รายงาน
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">สรุปข้อมูลสินค้าและสต็อกคงเหลือ</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-primary/10 rounded-lg"><Package className="w-5 h-5 text-primary" /></div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">สินค้าทั้งหมด</p>
                    <p className="text-2xl font-black mt-1">{totalProducts} <span className="text-sm font-normal text-slate-400">รายการ</span></p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg"><DollarSign className="w-5 h-5 text-emerald-500" /></div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">มูลค่าสต็อก (ต้นทุน)</p>
                    <p className="text-2xl font-black mt-1">฿{totalStockValue.toLocaleString('th-TH', { minimumFractionDigits: 0 })}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg"><TrendingUp className="w-5 h-5 text-blue-500" /></div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">มูลค่าสต็อก (ราคาขาย)</p>
                    <p className="text-2xl font-black mt-1">฿{totalSellingValue.toLocaleString('th-TH', { minimumFractionDigits: 0 })}</p>
                </div>
                <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-6 rounded-xl shadow-lg shadow-primary/20">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-white/20 rounded-lg"><ArrowUpRight className="w-5 h-5" /></div>
                    </div>
                    <p className="text-sm text-white/80 font-medium">กำไรที่คาดหวัง</p>
                    <p className="text-2xl font-black mt-1">฿{expectedProfit.toLocaleString('th-TH', { minimumFractionDigits: 0 })}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* สรุปตามหมวดหมู่ */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">สรุปตามหมวดหมู่</h3>
                    {categoryStats.length === 0 ? (
                        <p className="text-center text-slate-400 py-8">ยังไม่มีหมวดหมู่</p>
                    ) : (
                        <div className="space-y-4">
                            {categoryStats.map(cat => (
                                <div key={cat.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{cat.name}</p>
                                        <p className="text-xs text-slate-500">{cat.productCount} สินค้า · {cat.totalStock} หน่วยในสต็อก</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary">฿{cat.stockValue.toLocaleString()}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">มูลค่าสต็อก</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* สินค้ามูลค่าสูงสุด */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">สินค้ามูลค่าสต็อกสูงสุด</h3>
                    {topValueProducts.length === 0 ? (
                        <p className="text-center text-slate-400 py-8">ยังไม่มีสินค้า</p>
                    ) : (
                        <div className="space-y-3">
                            {topValueProducts.map((product, idx) => (
                                <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-black">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate">{product.name}</p>
                                        <p className="text-xs text-slate-500">{product.stock} หน่วย × ฿{Number(product.cost_price).toFixed(0)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-primary">฿{product.value.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* สินค้าสต็อกต่ำ / หมด */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-rose-500" />
                        สินค้าที่ต้องเติมสต็อก
                    </h3>
                    <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-3 py-1 rounded-full">
                        {lowStockProducts.length} รายการ
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold uppercase text-slate-500">สินค้า</th>
                                <th className="px-6 py-3 text-xs font-bold uppercase text-slate-500">หมวดหมู่</th>
                                <th className="px-6 py-3 text-xs font-bold uppercase text-slate-500 text-center">คงเหลือ</th>
                                <th className="px-6 py-3 text-xs font-bold uppercase text-slate-500 text-center">เกณฑ์แจ้งเตือน</th>
                                <th className="px-6 py-3 text-xs font-bold uppercase text-slate-500 text-center">สถานะ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {lowStockProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                        <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                        สต็อกสินค้าทั้งหมดอยู่ในระดับปกติ ✓
                                    </td>
                                </tr>
                            ) : (
                                lowStockProducts.map(p => (
                                    <tr key={p.id} className="hover:bg-red-50/30 dark:hover:bg-red-900/10 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{p.name}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{p.category?.name ?? '-'}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`font-bold ${p.stock === 0 ? 'text-slate-400' : 'text-rose-600'}`}>
                                                {p.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-slate-400">{p.low_stock_alert}</td>
                                        <td className="px-6 py-4 text-center">
                                            {p.stock === 0 ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> หมด
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                                                    <ArrowDownRight className="w-3 h-3" /> ต่ำ
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

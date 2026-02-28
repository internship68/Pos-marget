'use client';

import React from 'react';
import { useProductStore } from '@/frontend/store/product.store';
import { Calendar, Download, TrendingUp, Wallet, ShoppingCart, AlertTriangle, Coffee, Cake, Utensils } from 'lucide-react';

export default function DashboardPage() {
  const { products } = useProductStore();
  const lowStockCount = products.filter(p => p.stock <= p.low_stock_alert).length;

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
            7 วันล่าสุด
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold shadow-lg shadow-primary/25 flex items-center gap-2">
            <Download className="w-4 h-4" />
            ดาวน์โหลดรายงาน
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-green-500 text-xs font-bold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12.5%
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">ยอดขายรวมวันนี้</p>
          <p className="text-2xl font-black mt-1">฿45,280.00</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-green-500 text-xs font-bold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +5.2%
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">กำไรสุทธิ</p>
          <p className="text-2xl font-black mt-1">฿12,450.00</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <span className="text-slate-500 text-xs font-bold">กำลังรอจ่าย</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">รายการที่กำลังดำเนินการ</p>
          <p className="text-2xl font-black mt-1">24</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-rose-500 text-xs font-bold">ต้องเติมด่วน</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">สินค้าสต็อกต่ำ</p>
          <p className="text-2xl font-black mt-1">{lowStockCount}</p>
        </div>
      </div>

      {/* Charts & Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Trend Chart Area */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">แนวโน้มยอดขายรายสัปดาห์</h3>
            <select className="bg-slate-50 dark:bg-slate-800 border-none text-xs font-semibold rounded-lg focus:ring-1 focus:ring-primary py-1">
              <option>สัปดาห์นี้</option>
              <option>สัปดาห์ที่แล้ว</option>
            </select>
          </div>
          
          {/* Placeholder for Line Chart */}
          <div className="relative h-[300px] w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 flex items-end justify-between p-6 overflow-hidden">
            <div className="w-10 bg-primary/20 rounded-t h-20 relative group hover:bg-primary transition-colors cursor-pointer"></div>
            <div className="w-10 bg-primary/40 rounded-t h-40 relative group hover:bg-primary transition-colors cursor-pointer"></div>
            <div className="w-10 bg-primary/30 rounded-t h-32 relative group hover:bg-primary transition-colors cursor-pointer"></div>
            <div className="w-10 bg-primary/60 rounded-t h-56 relative group hover:bg-primary transition-colors cursor-pointer"></div>
            <div className="w-10 bg-primary/80 rounded-t h-72 relative group hover:bg-primary transition-colors cursor-pointer"></div>
            <div className="w-10 bg-primary/50 rounded-t h-48 relative group hover:bg-primary transition-colors cursor-pointer"></div>
            <div className="w-10 bg-primary rounded-t h-64 relative group hover:bg-primary transition-colors cursor-pointer"></div>
          </div>
          <div className="flex justify-between mt-4 px-2">
            <span className="text-[10px] font-bold text-slate-400">จันทร์</span>
            <span className="text-[10px] font-bold text-slate-400">อังคาร</span>
            <span className="text-[10px] font-bold text-slate-400">พุธ</span>
            <span className="text-[10px] font-bold text-slate-400">พฤหัสบดี</span>
            <span className="text-[10px] font-bold text-slate-400">ศุกร์</span>
            <span className="text-[10px] font-bold text-slate-400">เสาร์</span>
            <span className="text-[10px] font-bold text-slate-400">อาทิตย์</span>
          </div>
        </div>

        {/* Top Selling Products Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">สินค้ายอดนิยม</h3>
            <a className="text-primary text-xs font-bold hover:underline" href="#">ดูทั้งหมด</a>
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Coffee className="w-6 h-6 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">อเมริกาโน่เย็น</p>
                <p className="text-xs text-slate-500">เครื่องดื่ม</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black">฿18,200</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">245 รายการ</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Cake className="w-6 h-6 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">ครัวซองต์เนยสด</p>
                <p className="text-xs text-slate-500">เบเกอรี่</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black">฿12,450</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">152 รายการ</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Utensils className="w-6 h-6 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">พาสต้าซอสครีม</p>
                <p className="text-xs text-slate-500">อาหารจานหลัก</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black">฿7,600</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">45 รายการ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Placeholder Section */}
      <div className="mt-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold">ธุรกรรมล่าสุด</h3>
          <button className="text-sm text-primary font-bold">ส่งออกข้อมูล</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">รหัสรายการ</th>
                <th className="px-6 py-4">เวลา</th>
                <th className="px-6 py-4">ลูกค้า</th>
                <th className="px-6 py-4">สถานะ</th>
                <th className="px-6 py-4 text-right">ยอดชำระ</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">#POS-4921</td>
                <td className="px-6 py-4 text-slate-500">14:25, 12 ต.ค. 2566</td>
                <td className="px-6 py-4 font-medium">ลูกค้าทั่วไป</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-black uppercase">สำเร็จ</span>
                </td>
                <td className="px-6 py-4 text-right font-black">฿120.00</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">#POS-4920</td>
                <td className="px-6 py-4 text-slate-500">14:10, 12 ต.ค. 2566</td>
                <td className="px-6 py-4 font-medium">คุณมานะ เจริญพงษ์</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase">กำลังจ่าย</span>
                </td>
                <td className="px-6 py-4 text-right font-black">฿350.00</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">#POS-4919</td>
                <td className="px-6 py-4 text-slate-500">13:55, 12 ต.ค. 2566</td>
                <td className="px-6 py-4 font-medium">ลูกค้าทั่วไป</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase">ยกเลิก</span>
                </td>
                <td className="px-6 py-4 text-right font-black text-slate-400 line-through">฿45.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

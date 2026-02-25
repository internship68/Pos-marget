'use client';

import React, { useState } from 'react';
import { Search, Bell, Plus, TrendingUp, TrendingDown, Zap, Calendar, Download, Eye, Wallet, ShoppingCart, FileText, X, Printer } from 'lucide-react';

export default function TransactionsPage() {
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [transactions] = useState([
    { id: '#RCP001', date: '24 พ.ค. 67, 14:30', cashier: 'สมชาย', cashierInitials: 'SC', amount: 1250.00, method: 'เงินสด', status: 'สำเร็จ', items: [{ name: 'เอสเพรสโซ่ (ร้อน)', qty: 1, price: 55 }, { name: 'เค้กช็อกโกแลตหน้านิ่ม', qty: 1, price: 95 }] },
    { id: '#RCP002', date: '24 พ.ค. 67, 15:15', cashier: 'สมหญิง', cashierInitials: 'SY', amount: 890.00, method: 'โอนเงิน', status: 'สำเร็จ', items: [{ name: 'อเมริกาโน่ (เย็น)', qty: 2, price: 60 }] },
    { id: '#RCP003', date: '24 พ.ค. 67, 16:00', cashier: 'สมชาย', cashierInitials: 'SC', amount: 2100.00, method: 'บัตรเครดิต', status: 'รอดำเนินการ', items: [{ name: 'ชาไทยพรีเมียม', qty: 1, price: 55 }] },
    { id: '#RCP004', date: '24 พ.ค. 67, 16:45', cashier: 'วิชัย', cashierInitials: 'VC', amount: 450.00, method: 'เงินสด', status: 'ยกเลิก', items: [] },
  ]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">รายได้รวม</p>
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">฿120,000</p>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>+8.4% จากเดือนที่แล้ว</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">ค่าใช้จ่าย</p>
            <ShoppingCart className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">฿75,000</p>
          <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-sm font-semibold">
            <TrendingDown className="w-4 h-4" />
            <span>-5.2% จากเดือนที่แล้ว</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-primary text-white shadow-xl shadow-primary/20">
          <div className="flex items-center justify-between">
            <p className="text-primary/80 text-sm font-medium">กำไรสุทธิ</p>
            <Wallet className="w-5 h-5 text-white/80" />
          </div>
          <p className="text-white text-3xl font-bold">฿45,000</p>
          <div className="flex items-center gap-1 text-white/90 text-sm font-semibold">
            <Zap className="w-4 h-4" />
            <span>+12.1% ประสิทธิภาพสูง</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary text-white px-4 text-sm font-medium">
              วันนี้
            </button>
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 text-sm font-medium hover:bg-slate-200 transition-colors">
              7 วันที่ผ่านมา
            </button>
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 text-sm font-medium hover:bg-slate-200 transition-colors">
              30 วันที่ผ่านมา
            </button>
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 text-sm font-medium hover:bg-slate-50 transition-colors">
              <Calendar className="w-4 h-4" />
              <span>กำหนดเอง</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-lg h-9 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-200 transition-colors border border-transparent">
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button className="flex items-center gap-2 rounded-lg h-9 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-200 transition-colors border border-transparent">
              <Download className="w-4 h-4" />
              <span>CSV</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">เลขที่ใบเสร็จ</th>
                <th className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">วันที่/เวลา</th>
                <th className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">พนักงาน</th>
                <th className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">ยอดรวม</th>
                <th className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">ชำระโดย</th>
                <th className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">สถานะ</th>
                <th className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider text-right">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 text-sm font-semibold text-primary">{tx.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{tx.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">{tx.cashierInitials}</div>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{tx.cashier}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">฿{tx.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {tx.method}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tx.status === 'สำเร็จ' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      tx.status === 'รอดำเนินการ' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        tx.status === 'สำเร็จ' ? 'bg-emerald-500' :
                        tx.status === 'รอดำเนินการ' ? 'bg-amber-500' :
                        'bg-rose-500'
                      }`}></span>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedTx(tx)}
                      className="text-primary hover:text-primary/80 font-bold text-sm flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-4 h-4" />
                      <span>ดูใบเสร็จ</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                ใบเสร็จรับเงิน
              </h3>
              <button onClick={() => setSelectedTx(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto font-mono text-sm">
              <div className="text-center mb-6">
                <h2 className="text-xl font-black mb-1">POS STORE</h2>
                <p className="text-slate-500 text-xs">123 ถนนสุขุมวิท กรุงเทพฯ 10110</p>
                <p className="text-slate-500 text-xs">โทร. 02-123-4567</p>
              </div>

              <div className="flex justify-between mb-2 text-xs">
                <span className="text-slate-500">เลขที่:</span>
                <span className="font-bold">{selectedTx.id}</span>
              </div>
              <div className="flex justify-between mb-2 text-xs">
                <span className="text-slate-500">วันที่:</span>
                <span>{selectedTx.date}</span>
              </div>
              <div className="flex justify-between mb-6 text-xs">
                <span className="text-slate-500">แคชเชียร์:</span>
                <span>{selectedTx.cashier}</span>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 dark:border-slate-700 py-3 mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-slate-500 text-xs">
                      <th className="text-left font-normal pb-2">รายการ</th>
                      <th className="text-right font-normal pb-2">จำนวน</th>
                      <th className="text-right font-normal pb-2">ราคา</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTx.items?.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="py-1 pr-2">{item.name}</td>
                        <td className="py-1 text-right">{item.qty}</td>
                        <td className="py-1 text-right">{(item.price * item.qty).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between mb-2 font-bold text-base">
                <span>ยอดรวมสุทธิ</span>
                <span>฿{selectedTx.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mb-6">
                <span>วิธีชำระเงิน</span>
                <span>{selectedTx.method}</span>
              </div>

              <div className="text-center text-xs text-slate-500 mt-8">
                <p>ขอบคุณที่ใช้บริการ</p>
                <p>Please come again</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <Download className="w-4 h-4" />
                ดาวน์โหลด
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-xl font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors">
                <Printer className="w-4 h-4" />
                พิมพ์ใบเสร็จ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

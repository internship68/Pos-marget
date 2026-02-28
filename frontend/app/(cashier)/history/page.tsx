'use client';

import React, { useState } from 'react';
import { Search, Calendar, FileText, Download, Printer, X, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

export default function CashierHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<any>(null);

  // Mock transactions
  const transactions = [
    { id: 'TX-20231027-001', date: new Date(2023, 9, 27, 10, 30), total: 150, method: 'เงินสด', status: 'สำเร็จ', cashier: 'สมชาย ใจดี', items: [{ name: 'เอสเพรสโซ่ (ร้อน)', qty: 1, price: 55 }, { name: 'เค้กช็อกโกแลตหน้านิ่ม', qty: 1, price: 95 }] },
    { id: 'TX-20231027-002', date: new Date(2023, 9, 27, 11, 15), total: 240, method: 'โอนเงิน', status: 'สำเร็จ', cashier: 'สมชาย ใจดี', items: [{ name: 'อเมริกาโน่ (เย็น)', qty: 2, price: 60 }, { name: 'ครัวซองต์เนยสด', qty: 1, price: 85 }, { name: 'มัทฉะลาเต้ (เย็น)', qty: 1, price: 75 }] },
    { id: 'TX-20231027-003', date: new Date(2023, 9, 27, 12, 0), total: 55, method: 'เงินสด', status: 'สำเร็จ', cashier: 'สมชาย ใจดี', items: [{ name: 'ชาไทยพรีเมียม', qty: 1, price: 55 }] },
  ];

  const filteredTransactions = transactions.filter(tx => 
    tx.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">ประวัติรายการขาย</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">ตรวจสอบรายการขายและพิมพ์ใบเสร็จย้อนหลัง</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="ค้นหาเลขที่ใบเสร็จ..." 
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="date" 
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">เลขที่ใบเสร็จ</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">วันที่ / เวลา</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-right">ยอดรวม</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-center">วิธีชำระเงิน</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-medium text-slate-900 dark:text-white">{tx.id}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {format(tx.date, 'dd MMM yyyy HH:mm', { locale: th })}
                    </td>
                    <td className="p-4 text-right font-bold text-primary">฿{tx.total.toFixed(2)}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.method === 'เงินสด' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {tx.method}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setSelectedTx(tx)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="ดูใบเสร็จ"
                      >
                        <FileText className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      ไม่พบรายการขาย
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
                <span>{format(selectedTx.date, 'dd/MM/yyyy HH:mm')}</span>
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
                    {selectedTx.items.map((item: any, idx: number) => (
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
                <span>฿{selectedTx.total.toFixed(2)}</span>
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

'use client';

import React, { useState, useEffect } from 'react';
import { SalesService } from '@/lib/services/sales.service';
import type { Sale, SalesSummary } from '@/lib/services/sales.service';
import { TrendingUp, TrendingDown, Zap, Calendar, Download, Eye, Wallet, ShoppingCart, FileText, X, Printer, Loader2, Ban } from 'lucide-react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Sale[]>([]);
  const [summary, setSummary] = useState<SalesSummary>({ todayRevenue: 0, todayCount: 0, totalRevenue: 0, totalCount: 0 });
  const [selectedTx, setSelectedTx] = useState<Sale | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [salesData, summaryData] = await Promise.all([
        SalesService.getAll({ status: filterStatus }),
        SalesService.getSummary(),
      ]);
      setTransactions(salesData);
      setSummary(summaryData);
    } catch (err) {
      console.error('Failed to fetch sales data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterStatus]);

  const handleCancel = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกบิลนี้? สต็อกจะถูกคืนกลับ')) return;
    try {
      await SalesService.cancel(id);
      fetchData();
      setSelectedTx(null);
    } catch (err) {
      alert('ไม่สามารถยกเลิกบิลได้');
    }
  };

  const completedSales = transactions.filter(t => t.status === 'completed');
  const totalRevenue = completedSales.reduce((sum, s) => sum + Number(s.total), 0);
  const totalDiscount = completedSales.reduce((sum, s) => sum + Number(s.discount), 0);

  return (
    <div className="w-full">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">รายได้วันนี้</p>
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">฿{summary.todayRevenue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</p>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>{summary.todayCount} รายการ</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">ส่วนลด (ที่แสดง)</p>
            <ShoppingCart className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">฿{totalDiscount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</p>
          <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-sm font-semibold">
            <TrendingDown className="w-4 h-4" />
            <span>จากทั้งหมด {completedSales.length} บิล</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-xl p-6 bg-primary text-white shadow-xl shadow-primary/20">
          <div className="flex items-center justify-between">
            <p className="text-primary/80 text-sm font-medium">รายได้สะสมรวม</p>
            <Wallet className="w-5 h-5 text-white/80" />
          </div>
          <p className="text-white text-3xl font-bold">฿{summary.totalRevenue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</p>
          <div className="flex items-center gap-1 text-white/90 text-sm font-semibold">
            <Zap className="w-4 h-4" />
            <span>{summary.totalCount} รายการสะสม</span>
          </div>
        </div>
      </div>

      {/* Filter & Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {[
              { key: 'all', label: 'ทั้งหมด' },
              { key: 'completed', label: 'สำเร็จ' },
              { key: 'cancelled', label: 'ยกเลิก' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilterStatus(f.key)}
                className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium transition-colors ${filterStatus === f.key ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">เลขที่บิล</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">วันที่/เวลา</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">แคชเชียร์</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">ยอดรวม</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">ส่วนลด</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">สุทธิ</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">ชำระโดย</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">สถานะ</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-slate-400">ไม่มีข้อมูลธุรกรรม</td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-primary">{tx.receipt_number}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{new Date(tx.created_at).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}</td>
                      <td className="px-6 py-4 text-sm">{tx.cashier_name || '-'}</td>
                      <td className="px-6 py-4 text-sm">฿{Number(tx.subtotal).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-rose-500">{Number(tx.discount) > 0 ? `-฿${Number(tx.discount).toFixed(2)}` : '-'}</td>
                      <td className="px-6 py-4 text-sm font-bold">฿{Number(tx.total).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {tx.payment_method === 'cash' ? 'เงินสด' : 'โอนเงิน'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${tx.status === 'completed' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {tx.status === 'completed' ? 'สำเร็จ' : 'ยกเลิก'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setSelectedTx(tx)} className="text-primary hover:text-primary/80 font-bold text-sm flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            ดูบิล
                          </button>
                          {tx.status === 'completed' && (
                            <button onClick={() => handleCancel(tx.id)} className="text-rose-500 hover:text-rose-600 text-sm flex items-center gap-1 ml-2">
                              <Ban className="w-3 h-3" />
                              ยกเลิก
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
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
              <button onClick={() => setSelectedTx(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto font-mono text-sm">
              <div className="text-center mb-6">
                <h2 className="text-xl font-black mb-1">POS STORE</h2>
                <p className="text-slate-500 text-xs">123 ถนนสุขุมวิท กรุงเทพฯ 10110</p>
              </div>

              <div className="space-y-1 mb-4 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">เลขที่:</span><span className="font-bold">{selectedTx.receipt_number}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">วันที่:</span><span>{new Date(selectedTx.created_at).toLocaleString('th-TH')}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">แคชเชียร์:</span><span>{selectedTx.cashier_name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">ชำระโดย:</span><span>{selectedTx.payment_method === 'cash' ? 'เงินสด' : 'โอนเงิน'}</span></div>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 dark:border-slate-700 py-3 mb-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="text-left font-normal pb-2">รายการ</th>
                      <th className="text-right font-normal pb-2">จำนวน</th>
                      <th className="text-right font-normal pb-2">ราคา</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTx.items?.map((item) => (
                      <tr key={item.id}>
                        <td className="py-1 pr-2">{item.product_name}</td>
                        <td className="py-1 text-right">{item.quantity}</td>
                        <td className="py-1 text-right">฿{Number(item.total_price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-1 text-xs mb-4">
                <div className="flex justify-between"><span className="text-slate-500">ยอดรวม</span><span>฿{Number(selectedTx.subtotal).toFixed(2)}</span></div>
                {Number(selectedTx.discount) > 0 && (
                  <div className="flex justify-between text-red-500"><span>ส่วนลด</span><span>-฿{Number(selectedTx.discount).toFixed(2)}</span></div>
                )}
              </div>

              <div className="flex justify-between font-bold text-base border-t border-dashed border-slate-300 pt-2">
                <span>ยอดสุทธิ</span>
                <span>฿{Number(selectedTx.total).toFixed(2)}</span>
              </div>

              {selectedTx.status === 'cancelled' && (
                <div className="mt-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 text-center text-sm font-bold">
                  ❌ บิลนี้ถูกยกเลิกแล้ว
                </div>
              )}

              <div className="text-center text-xs text-slate-500 mt-6">
                <p>ขอบคุณที่ใช้บริการ</p>
                <p>Please come again</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
              <button onClick={() => setSelectedTx(null)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                ปิด
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

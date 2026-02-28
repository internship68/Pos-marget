'use client';

import React, { useState, useEffect } from 'react';
import { Search, Eye, FileText, X, Printer, Loader2, ShoppingBag, Calendar } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface SaleItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Sale {
  id: string;
  receipt_number: string;
  cashier_name: string;
  subtotal: number;
  discount: number;
  total: number;
  payment_method: string;
  status: string;
  created_at: string;
  items: SaleItem[];
}

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<Sale | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSales = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/sales`);
        if (res.ok) setTransactions(await res.json());
      } catch (err) {
        console.error('Failed to fetch sales', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSales();
  }, []);

  const filteredTx = transactions.filter(tx =>
    tx.receipt_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.cashier_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full w-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-primary" />
          ประวัติการขาย
        </h2>
      </div>

      <div className="relative mb-4">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ค้นหาเลขที่บิล..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-primary"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[70vh]">
            {filteredTx.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>ไม่มีข้อมูลการขาย</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTx.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-primary">{tx.receipt_number}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(tx.created_at).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="font-bold">฿{Number(tx.total).toFixed(2)}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${tx.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          <span className={`w-1 h-1 rounded-full ${tx.status === 'completed' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {tx.status === 'completed' ? 'สำเร็จ' : 'ยกเลิก'}
                        </span>
                      </div>
                      <button onClick={() => setSelectedTx(tx)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-primary">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
              <button onClick={() => setSelectedTx(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
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

              <div className="space-y-1 text-xs mb-2">
                <div className="flex justify-between"><span className="text-slate-500">ยอดรวม</span><span>฿{Number(selectedTx.subtotal).toFixed(2)}</span></div>
                {Number(selectedTx.discount) > 0 && (
                  <div className="flex justify-between text-red-500"><span>ส่วนลด</span><span>-฿{Number(selectedTx.discount).toFixed(2)}</span></div>
                )}
              </div>
              <div className="flex justify-between font-bold text-base border-t border-dashed border-slate-300 pt-2 mb-4">
                <span>ยอดสุทธิ</span>
                <span>฿{Number(selectedTx.total).toFixed(2)}</span>
              </div>

              <div className="text-center text-xs text-slate-500">
                <p>ขอบคุณที่ใช้บริการ</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <button onClick={() => setSelectedTx(null)} className="w-full py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" />
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

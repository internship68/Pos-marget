'use client';

import React, { useState } from 'react';
import { Settings, Store, Bell, Palette, Shield, Save, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);
    const [storeName, setStoreName] = useState('POS Store');
    const [storeAddress, setStoreAddress] = useState('123 ถนนสุขุมวิท กรุงเทพฯ 10110');
    const [storePhone, setStorePhone] = useState('02-123-4567');
    const [taxId, setTaxId] = useState('');
    const [lowStockThreshold, setLowStockThreshold] = useState(10);
    const [receiptFooter, setReceiptFooter] = useState('ขอบคุณที่ใช้บริการ');

    const handleSave = () => {
        // ตอนนี้เก็บใน local state ก่อน ยังไม่มี backend endpoint สำหรับ settings
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
                        <Settings className="w-8 h-8 text-primary" />
                        การตั้งค่า
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">ปรับแต่งการทำงานของระบบ POS</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* ข้อมูลร้านค้า */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                        <h3 className="font-bold flex items-center gap-2">
                            <Store className="w-5 h-5 text-primary" />
                            ข้อมูลร้านค้า
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">ข้อมูลนี้จะแสดงบนใบเสร็จ</p>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ชื่อร้านค้า</label>
                            <input type="text" value={storeName} onChange={e => setStoreName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">เบอร์โทรศัพท์</label>
                            <input type="text" value={storePhone} onChange={e => setStorePhone(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ที่อยู่ร้านค้า</label>
                            <input type="text" value={storeAddress} onChange={e => setStoreAddress(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">เลขประจำตัวผู้เสียภาษี</label>
                            <input type="text" value={taxId} onChange={e => setTaxId(e.target.value)} placeholder="ไม่บังคับ"
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ข้อความท้ายใบเสร็จ</label>
                            <input type="text" value={receiptFooter} onChange={e => setReceiptFooter(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary" />
                        </div>
                    </div>
                </div>

                {/* การแจ้งเตือน */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                        <h3 className="font-bold flex items-center gap-2">
                            <Bell className="w-5 h-5 text-amber-500" />
                            การแจ้งเตือน
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">ตั้งค่าเกณฑ์การแจ้งเตือนต่างๆ</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-2 max-w-xs">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">เกณฑ์แจ้งเตือนสต็อกต่ำ (ค่าเริ่มต้นสำหรับสินค้าใหม่)</label>
                            <input type="number" value={lowStockThreshold} onChange={e => setLowStockThreshold(Number(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary" />
                            <p className="text-xs text-slate-400">สินค้าที่มีจำนวนน้อยกว่าหรือเท่ากับค่านี้จะแสดงแจ้งเตือนสต็อกต่ำ</p>
                        </div>
                    </div>
                </div>

                {/* ธีมและการแสดงผล */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                        <h3 className="font-bold flex items-center gap-2">
                            <Palette className="w-5 h-5 text-violet-500" />
                            การแสดงผล
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">โหมดมืด (Dark Mode)</p>
                                <p className="text-xs text-slate-500">ระบบจะปรับตามค่าของ Browser อัตโนมัติ</p>
                            </div>
                            <div className="w-10 h-6 rounded-full bg-primary relative cursor-pointer">
                                <div className="w-4 h-4 rounded-full bg-white absolute right-1 top-1 shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ความปลอดภัย */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                        <h3 className="font-bold flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-500" />
                            ความปลอดภัย
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">เปลี่ยนรหัสผ่าน</p>
                                <p className="text-xs text-slate-500">เปลี่ยนรหัสผ่านสำหรับบัญชีผู้ดูแลระบบ</p>
                            </div>
                            <button className="px-4 py-2 text-sm font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors">
                                เปลี่ยน
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">สำรองข้อมูล</p>
                                <p className="text-xs text-slate-500">ข้อมูลจะถูกสำรองอัตโนมัติผ่าน Supabase</p>
                            </div>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                เปิดใช้งาน
                            </span>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${saved ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-primary shadow-primary/30 hover:bg-primary/90'
                            }`}
                    >
                        {saved ? (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                บันทึกสำเร็จ
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                บันทึกการตั้งค่า
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

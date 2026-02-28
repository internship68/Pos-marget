'use client';

import React, { useState, useEffect } from 'react';
import { Users, Shield, User, Edit, Trash2, Mail, Calendar, ShieldCheck, UserPlus } from 'lucide-react';
import { useUserStore, UserProfile } from '@/store/user.store';

export default function UsersManagementPage() {
    const { users, fetchUsers, updateUserRole, deleteUser, isLoading, error } = useUserStore();
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleUpdateRole = async (id: string, role: 'admin' | 'cashier') => {
        try {
            await updateUserRole(id, role);
        } catch (err: any) {
            alert('ไม่สามารถอัปเดตบทบาทได้: ' + err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้ออกจากระบบ POS? (บัญชี Auth หลักจะไม่ถูกลบ)')) {
            try {
                await deleteUser(id);
            } catch (err: any) {
                alert('ไม่สามารถลบผู้ใช้ได้: ' + err.message);
            }
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        จัดการผู้ใช้งานและสิทธิ์
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">กำหนดบทบาทและจัดการสิทธิ์การเข้าถึงระบบของพนักงาน</p>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30 flex items-center gap-3">
                    <Trash2 className="w-5 h-5" />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">ข้อมูลผู้ใช้งาน</th>
                                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">อีเมล</th>
                                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">บทบาทปัจจุบัน</th>
                                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">วันที่ลงทะเบียน</th>
                                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">จัดการบทบาท</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                                            <span>กำลังโหลดข้อมูลผู้ใช้...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                                        ไม่พบข้อมูลผู้ใช้งานในระบบ
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {user.full_name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-slate-100">{user.full_name || 'ไม่ระบุชื่อ'}</p>
                                                    <p className="text-xs text-slate-400 font-mono">ID: {user.id.substring(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                                <Mail className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm">{user.email || 'ไม่ระบุอีเมล'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-tight ${user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}>
                                                {user.role === 'admin' ? (
                                                    <>
                                                        <ShieldCheck className="w-3.5 h-3.5" />
                                                        ADMIN
                                                    </>
                                                ) : (
                                                    <>
                                                        <User className="w-3.5 h-3.5" />
                                                        CASHIER
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                <Calendar className="w-4 h-4" />
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString('th-TH') : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleUpdateRole(user.id, e.target.value as 'admin' | 'cashier')}
                                                    className="text-xs font-bold bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                                                >
                                                    <option value="admin">มอบสิทธิ์ ADMIN</option>
                                                    <option value="cashier">มอบสิทธิ์ CASHIER</option>
                                                </select>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="ลบผู้ใช้"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
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

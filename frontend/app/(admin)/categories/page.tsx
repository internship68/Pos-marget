'use client';

import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Tags } from 'lucide-react';
import { useProductStore } from '@/store/product.store';

export default function CategoriesPage() {
  const { categories, fetchCategories, addCategory, updateCategory, deleteCategory } = useProductStore();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenModal = (category?: { id: string; name: string }) => {
    if (category) {
      setEditingId(category.id);
      setCategoryName(category.name);
    } else {
      setEditingId(null);
      setCategoryName('');
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!categoryName.trim()) return;
    setIsLoading(true);
    try {
      if (editingId) {
        await updateCategory(editingId, categoryName);
      } else {
        await addCategory({ name: categoryName });
      }
      setShowModal(false);
    } catch {
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?')) {
      await deleteCategory(id);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Tags className="w-6 h-6 text-primary" />
            จัดการหมวดหมู่สินค้า
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">เพิ่ม แก้ไข หรือลบหมวดหมู่สินค้าในระบบ</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary/90 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          เพิ่มหมวดหมู่
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">รหัสหมวดหมู่</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">ชื่อหมวดหมู่</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                  ไม่มีข้อมูลหมวดหมู่สินค้า
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">{category.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{category.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(category)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
                        title="แก้ไข"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-500"
                        title="ลบ"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {editingId ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
              </h3>
            </div>
            <div className="p-6">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                ชื่อหมวดหมู่ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="เช่น เครื่องดื่ม, อาหาร, ของใช้"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                disabled={!categoryName.trim() || isLoading}
                className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

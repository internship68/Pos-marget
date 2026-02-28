'use client';

import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Package, AlertTriangle, Wallet, Tag, Edit, PlusSquare, Image as ImageIcon, Trash2, X } from 'lucide-react';
import { useProductStore } from '@/store/product.store';
import { Product } from '@/store/pos.store';

export default function ProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct, adjustStock, setStock, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);

  // Form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', barcode: '', category: '', cost_price: 0, selling_price: 0, stock: 0, low_stock_alert: 10, image_url: ''
  });

  // Stock state
  const [selectedProductForStock, setSelectedProductForStock] = useState<Product | null>(null);
  const [stockAmount, setStockAmount] = useState<number>(0);
  const [stockAction, setStockAction] = useState<'increase' | 'decrease' | 'set'>('increase');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter state
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Derived data
  const filteredProducts = products.filter(p => {
    const matchCategory = filterCategory === 'all' ||
      (filterCategory === 'low_stock' ? p.stock <= p.low_stock_alert : p.category === filterCategory);
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  const lowStockCount = products.filter(p => p.stock <= p.low_stock_alert).length;
  const totalValue = products.reduce((sum, p) => sum + (p.cost_price * p.stock), 0);

  // Handlers
  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', barcode: '', category: categories[0]?.name || '', cost_price: 0, selling_price: 0, stock: 0, low_stock_alert: 10, image_url: ''
      });
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.barcode) return alert('กรุณากรอกชื่อและบาร์โค้ด');

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData as Omit<Product, 'id'>);
    }
    setShowProductModal(false);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteProduct(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleOpenStockModal = (product: Product) => {
    setSelectedProductForStock(product);
    setStockAmount(0);
    setStockAction('increase');
    setShowStockModal(true);
  };

  const handleSaveStock = () => {
    if (!selectedProductForStock) return;

    if (stockAction === 'increase') {
      adjustStock(selectedProductForStock.id, stockAmount);
    } else if (stockAction === 'decrease') {
      adjustStock(selectedProductForStock.id, -stockAmount);
    } else {
      setStock(selectedProductForStock.id, stockAmount);
    }
    setShowStockModal(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-sm font-medium">สินค้าทั้งหมด</span>
            <Package className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold leading-tight">{products.length} <span className="text-xs font-normal text-slate-400">รายการ</span></p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-sm font-medium text-red-500">สินค้าสต็อกต่ำ</span>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold leading-tight text-red-600">
            {lowStockCount} <span className="text-xs font-normal text-slate-400">รายการ</span>
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-sm font-medium">มูลค่าสต็อกรวม</span>
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold leading-tight">
            ฿{totalValue.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-sm font-medium">หมวดหมู่ทั้งหมด</span>
            <Tag className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold leading-tight">{categories.length} <span className="text-xs font-normal text-slate-400">หมวดหมู่</span></p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          <button
            onClick={() => setFilterCategory('all')}
            className={`flex shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filterCategory === 'all' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'}`}
          >
            ทั้งหมด
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.name)}
              className={`flex shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filterCategory === cat.name ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'}`}
            >
              {cat.name}
            </button>
          ))}
          <button
            onClick={() => setFilterCategory('low_stock')}
            className={`flex shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filterCategory === 'low_stock' ? 'bg-red-500 text-white' : 'bg-white dark:bg-slate-900 border border-red-200 text-red-500 hover:bg-red-50'}`}
          >
            <AlertTriangle className="w-4 h-4" />
            สต็อกต่ำ
          </button>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อสินค้า หรือ บาร์โค้ด..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-primary focus:border-primary"
            />
          </div>
          <button
            onClick={() => handleOpenProductModal()}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary/90"
          >
            <PlusCircle className="w-4 h-4" />
            เพิ่มสินค้า
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">รูปภาพ</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">บาร์โค้ด / ชื่อสินค้า</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">หมวดหมู่</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">ต้นทุน / ขาย</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">สต็อกคงเหลือ</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">สถานะ</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">ไม่พบข้อมูลสินค้า</td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${product.stock <= product.low_stock_alert ? 'bg-red-50/30 dark:bg-red-900/10' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-mono">{product.barcode}</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-col">
                      <span className="text-slate-400">ทุน: ฿{product.cost_price.toFixed(2)}</span>
                      <span className="font-medium">ขาย: ฿{product.selling_price.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${product.stock === 0 ? 'text-slate-400' : product.stock <= product.low_stock_alert ? 'text-red-600' : ''}`}>
                      {product.stock} <span className="text-xs font-normal text-slate-400">หน่วย</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {product.stock === 0 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span> สินค้าหมด
                      </span>
                    ) : product.stock <= product.low_stock_alert ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                        <AlertTriangle className="w-3 h-3" /> สต็อกต่ำ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span> ปกติ
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenProductModal(product)}
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500"
                        title="แก้ไขสินค้า"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenStockModal(product)}
                        className="p-1.5 rounded hover:bg-primary/10 transition-colors text-primary"
                        title="จัดการสต็อก"
                      >
                        <PlusSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(product.id)}
                        className="p-1.5 rounded hover:bg-red-50 transition-colors text-red-500"
                        title="ลบสินค้า"
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

      {/* Add/Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col">
            <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
              </h2>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Upload */}
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-800 relative group">
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400 flex flex-col items-center">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-xs font-medium">อัปโหลดรูปภาพ</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {formData.image_url && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="text-white text-xs font-bold">เปลี่ยนรูปภาพ</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ชื่อสินค้า <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">บาร์โค้ด <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">หมวดหมู่</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary"
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">แจ้งเตือนสต็อกต่ำ</label>
                  <input
                    type="number"
                    value={formData.low_stock_alert}
                    onChange={e => setFormData({ ...formData, low_stock_alert: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ต้นทุน (บาท)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost_price}
                    onChange={e => setFormData({ ...formData, cost_price: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ราคาขาย (บาท)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.selling_price}
                    onChange={e => setFormData({ ...formData, selling_price: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary"
                  />
                </div>
                {!editingProduct && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">สต็อกเริ่มต้น</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => setShowProductModal(false)} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                ยกเลิก
              </button>
              <button onClick={handleSaveProduct} className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary/90 transition-all">
                บันทึกข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showStockModal && selectedProductForStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                จัดการสต็อกสินค้า
              </h3>
              <button onClick={() => setShowStockModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm">
                  {selectedProductForStock.image_url ? (
                    <img src={selectedProductForStock.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Package className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedProductForStock.name}</p>
                  <p className="text-sm text-slate-500">สต็อกปัจจุบัน: <span className="font-bold text-primary">{selectedProductForStock.stock}</span> หน่วย</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <button
                    onClick={() => setStockAction('increase')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${stockAction === 'increase' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    เพิ่มสต็อก
                  </button>
                  <button
                    onClick={() => setStockAction('decrease')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${stockAction === 'decrease' ? 'bg-white dark:bg-slate-700 shadow-sm text-rose-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    ลดสต็อก
                  </button>
                  <button
                    onClick={() => setStockAction('set')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${stockAction === 'set' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    ปรับยอด
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {stockAction === 'increase' ? 'จำนวนที่ต้องการเพิ่ม' : stockAction === 'decrease' ? 'จำนวนที่ต้องการลด' : 'ยอดสต็อกที่ถูกต้อง'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stockAmount}
                    onChange={e => setStockAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary text-lg font-bold"
                  />
                </div>

                {stockAmount > 0 && (
                  <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${stockAction === 'increase' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    stockAction === 'decrease' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>สต็อกใหม่จะเป็น: {
                      stockAction === 'increase' ? selectedProductForStock.stock + stockAmount :
                        stockAction === 'decrease' ? Math.max(0, selectedProductForStock.stock - stockAmount) :
                          stockAmount
                    } หน่วย</span>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
              <button
                onClick={() => setShowStockModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveStock}
                className={`px-6 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm ${stockAction === 'increase' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  stockAction === 'decrease' ? 'bg-rose-600 hover:bg-rose-700' :
                    'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                ยืนยันการปรับสต็อก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">ยืนยันการลบสินค้า</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้? การกระทำนี้ไม่สามารถเรียกคืนได้</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-md shadow-red-500/20"
              >
                ลบสินค้า
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


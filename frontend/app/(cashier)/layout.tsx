'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Monitor } from 'lucide-react';

export default function CashierLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, checkSession, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full font-bold"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="text-primary">
            <Monitor className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight tracking-tight">ระบบขายหน้าร้าน (POS)</h1>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
              <span>พนักงานแคชเชียร์: {user?.name || 'สมชาย ใจดี'} (จุดบริการ 01)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/pos"
              className={`font-semibold pb-1 transition-colors ${pathname === '/pos' ? 'text-primary border-b-2 border-primary' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}
            >
              การขาย
            </Link>
            <Link
              href="/history"
              className={`font-semibold pb-1 transition-colors ${pathname === '/history' ? 'text-primary border-b-2 border-primary' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}
            >
              ประวัติรายการ
            </Link>
            <Link
              href="/stock"
              className={`font-semibold pb-1 transition-colors ${pathname === '/stock' ? 'text-primary border-b-2 border-primary' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}
            >
              สต็อกสินค้า
            </Link>
          </nav>
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}

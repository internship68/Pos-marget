'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Lock, AtSign, Key, Eye, EyeOff, LogIn, HelpCircle, Monitor, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, isLoading, checkSession, user: authUser } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (authUser) {
      if (authUser.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/pos');
      }
    }
  }, [authUser, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/pos');
      }
    } catch (err: any) {
      setLocalError(err.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 lg:px-40 bg-white dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-lg text-white">
            <Monitor className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-tight">ระบบ POS</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">V 2.4.0</span>
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors hover:bg-primary/10 hover:text-primary">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-[480px] flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-primary/5 border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="h-48 bg-primary/10 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
              <div className="z-10 text-center">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100 dark:border-slate-700">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">ยินดีต้อนรับกลับมา</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">กรุณาเข้าสู่ระบบเพื่อเริ่มใช้งาน</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
            </div>

            <div className="p-8">
              <form className="space-y-5" onSubmit={handleLogin}>
                {localError && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-xs font-medium flex items-start gap-2 border border-red-100 dark:border-red-800/30">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{localError}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-2">
                    <AtSign className="w-4 h-4" />
                    อีเมล
                  </label>
                  <input
                    className="w-full h-12 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 px-4"
                    placeholder="ระบุอีเมล"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      รหัสผ่าน
                    </label>
                    <a className="text-primary text-xs font-semibold hover:underline" href="#">ลืมรหัสผ่าน?</a>
                  </div>
                  <div className="relative">
                    <input
                      className="w-full h-12 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 px-4"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer" id="remember" type="checkbox" />
                  <label className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none" htmlFor="remember">จดจำการเข้าใช้งานของฉัน</label>
                </div>

                <button
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all shadow-lg shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    <LogIn className="w-5 h-5" />
                  )}
                  {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </button>
              </form>
            </div>
          </div>

          <div className="text-center px-4">
            <p className="text-slate-500 text-sm">
              ต้องการความช่วยเหลือ? ติดต่อฝ่ายสนับสนุนโทร <span className="font-bold text-primary">02-XXX-XXXX</span>
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-auto py-6 px-4 text-center border-t border-slate-200 dark:border-slate-800">
        <p className="text-slate-400 text-xs font-medium">© 2024 ระบบบริหารจัดการ ณ จุดขาย (POS) | พัฒนาโดย TechSolutions Co., Ltd.</p>
      </footer>
    </div>
  );
}

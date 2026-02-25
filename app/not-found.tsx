import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <h2 className="text-4xl font-bold mb-4">404 - ไม่พบหน้าที่ต้องการ</h2>
      <p className="text-slate-500 mb-8">หน้าที่คุณพยายามเข้าถึงไม่มีอยู่ หรืออาจถูกย้ายไปแล้ว</p>
      <Link href="/login" className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors">
        กลับสู่หน้าหลัก
      </Link>
    </div>
  );
}

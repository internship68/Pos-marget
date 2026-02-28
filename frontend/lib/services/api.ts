/**
 * API Configuration — จุดเดียวสำหรับ Base URL
 * ใช้ environment variable NEXT_PUBLIC_API_URL จาก .env.local
 * ถ้าไม่มีจะ fallback เป็น localhost (dev mode เท่านั้น)
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Helper สำหรับ fetch + error handling
 */
export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: `Request failed: ${res.status}` }));
        throw new Error(err.message || `Request failed: ${res.status}`);
    }

    // DELETE อาจไม่มี body
    if (res.status === 204 || res.headers.get('content-length') === '0') {
        return undefined as T;
    }

    return res.json();
}

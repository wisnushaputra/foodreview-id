'use client';

import { useEffect, useState, Suspense, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const TOAST_MESSAGES: Record<string, { message: string; type: 'success' | 'error' | 'info' }> = {
  restaurant_created: { message: 'Restoran baru berhasil didaftarkan! 🎉', type: 'success' },
  restaurant_updated: { message: 'Informasi restoran berhasil diperbarui! 👍', type: 'success' },
  restaurant_deleted: { message: 'Restoran beserta seluruh ulasannya telah berhasil dihapus.', type: 'success' },
  review_created: { message: 'Ulasan Anda berhasil diterbitkan! Terima kasih atas kontribusinya. 🌟', type: 'success' },
  review_updated: { message: 'Ulasan Anda berhasil diperbarui! ✏️', type: 'success' },
  review_deleted: { message: 'Ulasan telah berhasil dihapus.', type: 'success' },
  link_copied: { message: 'Tautan restoran berhasil disalin ke clipboard! 🔗', type: 'success' },
  error: { message: 'Terjadi kesalahan sistem. Silakan coba kembali.', type: 'error' },
};

function ToastListener({ onShow }: { onShow: (message: string, type: 'success' | 'error' | 'info') => void }) {
  const searchParams = useSearchParams();
  const onShowRef = useRef(onShow);

  // Selalu update ref ke fungsi terbaru
  useEffect(() => {
    onShowRef.current = onShow;
  }, [onShow]);

  useEffect(() => {
    const successVal = searchParams.get('success');
    const errorVal = searchParams.get('error');
    const toastKey = successVal || errorVal;

    if (toastKey && TOAST_MESSAGES[toastKey]) {
      const config = TOAST_MESSAGES[toastKey];
      onShowRef.current(config.message, config.type);

      // Hapus search parameter dari URL secara bersih tanpa memicu reload halaman
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  }, [searchParams]);

  return null;
}

export default function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Hapus otomatis setelah 4 detik
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  // Listener untuk event kustom 'show-toast'
  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; type: 'success' | 'error' | 'info' }>;
      if (customEvent.detail) {
        addToast(customEvent.detail.message, customEvent.detail.type);
      }
    };

    window.addEventListener('show-toast', handleToastEvent);
    return () => window.removeEventListener('show-toast', handleToastEvent);
  }, [addToast]);

  return (
    <>
      {/* Bungkus hook useSearchParams dengan Suspense agar Next.js tidak deopt ke SSR dinamis */}
      <Suspense fallback={null}>
        <ToastListener onShow={addToast} />
      </Suspense>

      {/* Floating Toast Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-slide-in-right ${
              t.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-100'
                : t.type === 'error'
                ? 'border-rose-500/30 bg-rose-50/95 dark:bg-rose-950/90 text-rose-900 dark:text-rose-100'
                : 'border-zinc-200 bg-white/95 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100'
            }`}
          >
            {/* Status Icons */}
            <span className="mt-0.5 flex-shrink-0">
              {t.type === 'success' ? (
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : t.type === 'error' ? (
                <svg className="w-5 h-5 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </span>

            {/* Message Body */}
            <div className="flex-grow text-xs font-semibold leading-relaxed">
              {t.message}
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(t.id)}
              className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity cursor-pointer p-0.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

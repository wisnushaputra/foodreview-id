'use client';

export default function ShareButton() {
  
  const triggerToast = (message: string, type: 'success' | 'error' | 'info') => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('show-toast', {
        detail: { message, type }
      });
      window.dispatchEvent(event);
    }
  };

  const showManualPrompt = (text: string) => {
    if (typeof window !== 'undefined') {
      window.prompt('Salin tautan di bawah ini secara manual:', text);
    }
  };

  const fallbackCopyText = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Hindari scrolling halaman dan sembunyikan element
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.opacity = '0';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        triggerToast('Tautan restoran berhasil disalin ke clipboard! 🔗', 'success');
      } else {
        console.warn('Gagal menyalin menggunakan fallback execCommand, beralih ke prompt manual');
        showManualPrompt(text);
      }
    } catch (err) {
      console.warn('Error pada fallback execCommand, beralih ke prompt manual:', err);
      showManualPrompt(text);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const textToCopy = window.location.href;

      try {
        // Gunakan navigator.clipboard jika tersedia (Secure Context / HTTPS / Localhost)
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          navigator.clipboard.writeText(textToCopy)
            .then(() => {
              triggerToast('Tautan restoran berhasil disalin ke clipboard! 🔗', 'success');
            })
            .catch((err) => {
              console.warn('Gagal menggunakan navigator.clipboard (Promise rejected), beralih ke fallback...', err);
              fallbackCopyText(textToCopy);
            });
        } else {
          // Fallback jika API tidak tersedia
          fallbackCopyText(textToCopy);
        }
      } catch (err) {
        console.warn('Error saat mengakses clipboard API (Sync Exception), beralih ke fallback...', err);
        fallbackCopyText(textToCopy);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      type="button"
      className="flex-1 inline-flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm cursor-pointer gap-2"
    >
      {/* Share / Copy Icon */}
      <svg className="w-4 h-4 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 10.742l4.632-2.316m0 0a3 3 0 102.267-2.318 3 3 0 00-2.267 2.318zm-4.632 2.516L13.316 16.5m0 0a3 3 0 102.267-2.318 3 3 0 00-2.267 2.318zM6 13a3 3 0 110-6 3 3 0 010 6z" />
      </svg>
      Bagikan
    </button>
  );
}

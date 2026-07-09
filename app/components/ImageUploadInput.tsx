'use client';

import { useState } from 'react';

export default function ImageUploadInput() {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (file) {
      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        setError('File yang diunggah harus berupa gambar!');
        e.target.value = '';
        setPreview(null);
        return;
      }

      // Validasi ukuran file (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('Ukuran gambar melebihi 5MB! Silakan pilih file yang lebih kecil.');
        e.target.value = '';
        setPreview(null);
        return;
      }

      // Buat preview gambar lokal
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        Pilih File Gambar
      </label>
      <input
        type="file"
        name="imageFile"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full text-sm text-zinc-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-zinc-200 dark:file:border-zinc-800 file:text-xs file:font-semibold file:bg-zinc-50 dark:file:bg-zinc-900 file:text-zinc-700 dark:file:text-zinc-300 hover:file:bg-zinc-100 dark:hover:file:bg-zinc-850 cursor-pointer"
      />
      {error && (
        <p className="text-xs text-rose-500 dark:text-rose-400 font-medium transition-all duration-150 animate-pulse">
          ⚠️ {error}
        </p>
      )}
      {preview && (
        <div className="mt-2.5 relative rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 h-28 w-44 bg-zinc-50 dark:bg-zinc-900 shadow-sm">
          <img src={preview} alt="Preview Unggahan" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
            <span className="text-[10px] text-white font-semibold">Preview Unggahan</span>
          </div>
        </div>
      )}
    </div>
  );
}

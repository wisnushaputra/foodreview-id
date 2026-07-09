import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import ImageUploadInput from "@/app/components/ImageUploadInput";

export default function NewRestaurantPage() {
  async function createRestaurant(formData: FormData) {
    "use server";

    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const location = formData.get("location")?.toString();
    const imageUrl = formData.get("imageUrl")?.toString();
    const imageFile = formData.get("imageFile") as File | null;

    if (!name || !description || !location) {
      return; // Handle error
    }

    let finalImageUrl = imageUrl || "";

    // Logika upload file lokal jika ada file yang diunggah
    if (imageFile && imageFile.size > 0 && imageFile.name) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Path folder public/uploads
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        // Buat folder jika belum ada
        await mkdir(uploadDir, { recursive: true });

        // Generate nama file unik dengan timestamp
        const uniqueFilename = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
        const filePath = path.join(uploadDir, uniqueFilename);

        // Tulis file ke lokal disk
        await writeFile(filePath, buffer);

        // Set URL gambar publik
        finalImageUrl = `/uploads/${uniqueFilename}`;
      } catch (uploadError) {
        console.error("Gagal mengunggah file gambar:", uploadError);
      }
    }

    await prisma.restaurant.create({
      data: {
        name,
        description,
        location,
        imageUrl: finalImageUrl || null,
      },
    });

    redirect("/");
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Back Button */}
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-800 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-200/50 bg-white p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Tambah Restoran Baru</h1>
          <p className="text-xs text-zinc-500 mt-1">Masukkan detail informasi restoran untuk dibagikan ke komunitas.</p>
        </div>

        <form action={createRestaurant} encType="multipart/form-data" className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nama Restoran</label>
            <input 
              type="text" 
              name="name" 
              placeholder="Contoh: Bakmi GM"
              className="w-full rounded-lg border border-zinc-200 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none transition-colors duration-150" 
              required 
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Lokasi</label>
            <input 
              type="text" 
              name="location" 
              placeholder="Contoh: Jakarta, Bandung, dll"
              className="w-full rounded-lg border border-zinc-200 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none transition-colors duration-150" 
              required 
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Deskripsi</label>
            <textarea 
              name="description" 
              rows={4}
              placeholder="Berikan deskripsi singkat tentang menu andalan, suasana tempat, dll..."
              className="w-full rounded-lg border border-zinc-200 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none transition-colors duration-150 resize-none" 
              required
            ></textarea>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">URL Gambar (Dari Internet)</label>
            <input 
              type="url" 
              name="imageUrl" 
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-lg border border-zinc-200 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none transition-colors duration-150" 
            />
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-150"></div>
            <span className="flex-shrink mx-4 text-zinc-400 text-[10px] font-semibold uppercase tracking-widest">Atau Unggah Dari Lokal</span>
            <div className="flex-grow border-t border-zinc-150"></div>
          </div>

          <ImageUploadInput />

          <div className="pt-4 flex items-center gap-3">
            <Link 
              href="/" 
              className="flex-1 inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Batal
            </Link>
            <button 
              type="submit" 
              className="flex-1 inline-flex items-center justify-center rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-850 active:scale-95 transition-all duration-150 shadow-sm"
            >
              Simpan Restoran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


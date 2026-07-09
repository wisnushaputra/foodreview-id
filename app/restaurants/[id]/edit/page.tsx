import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export default async function EditRestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  async function loadRestaurant(id: string) {
    'use server';
    return await prisma.restaurant.findUnique({ where: { id } });
  }

  async function updateRestaurant(formData: FormData) {
    "use server";
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const location = formData.get("location")?.toString();
    const imageUrl = formData.get("imageUrl")?.toString();
    const imageFile = formData.get("imageFile") as File | null;

    if (!name || !description || !location) return;

    let finalImageUrl = imageUrl || "";

    // Logika upload file lokal jika ada file baru yang diunggah
    if (imageFile && imageFile.size > 0 && imageFile.name) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const uniqueFilename = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
        const filePath = path.join(uploadDir, uniqueFilename);

        await writeFile(filePath, buffer);
        finalImageUrl = `/uploads/${uniqueFilename}`;
      } catch (uploadError) {
        console.error("Gagal mengunggah file gambar saat edit:", uploadError);
      }
    }

    await prisma.restaurant.update({
      where: { id },
      data: {
        name,
        description,
        location,
        imageUrl: finalImageUrl || null,
      },
    });

    redirect(`/restaurants/${id}`);
  }

  // Preload existing data
  const restaurant = await loadRestaurant(id);

  if (!restaurant) {
    return (
      <main className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-semibold text-zinc-800">Restoran tidak ditemukan</h2>
        <Link href="/" className="text-sm font-medium text-zinc-950 underline hover:text-zinc-700">
          Kembali ke Beranda
        </Link>
      </main>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Back Button */}
      <div>
        <Link href={`/restaurants/${id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-450 hover:text-zinc-800 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Detail
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-200/50 bg-white p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Edit Restoran</h1>
          <p className="text-xs text-zinc-450 mt-1">Ubah detail informasi untuk restoran {restaurant.name}.</p>
        </div>

        <form action={updateRestaurant} encType="multipart/form-data" className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nama Restoran</label>
            <input 
              type="text" 
              name="name" 
              defaultValue={restaurant.name}
              className="w-full rounded-lg border border-zinc-200 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none transition-colors duration-150" 
              required 
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Lokasi</label>
            <input 
              type="text" 
              name="location" 
              defaultValue={restaurant.location}
              className="w-full rounded-lg border border-zinc-200 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none transition-colors duration-150" 
              required 
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Deskripsi</label>
            <textarea 
              name="description" 
              rows={4}
              defaultValue={restaurant.description}
              className="w-full rounded-lg border border-zinc-200 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none transition-colors duration-150 resize-none" 
              required
            ></textarea>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">URL Gambar (Dari Internet)</label>
            <input 
              type="url" 
              name="imageUrl" 
              defaultValue={restaurant.imageUrl || ""}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-lg border border-zinc-200 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none transition-colors duration-150" 
            />
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-150"></div>
            <span className="flex-shrink mx-4 text-zinc-400 text-[10px] font-semibold uppercase tracking-widest">Atau Ganti Gambar Dari Lokal</span>
            <div className="flex-grow border-t border-zinc-150"></div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Pilih File Gambar Baru</label>
            <input 
              type="file" 
              name="imageFile" 
              accept="image/*"
              className="w-full text-sm text-zinc-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-zinc-200 file:text-xs file:font-semibold file:bg-zinc-50 file:text-zinc-700 hover:file:bg-zinc-100 cursor-pointer" 
            />
          </div>

          <div className="pt-4 flex items-center gap-3">
            <Link 
              href={`/restaurants/${id}`} 
              className="flex-1 inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Batal
            </Link>
            <button 
              type="submit" 
              className="flex-1 inline-flex items-center justify-center rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-850 active:scale-95 transition-all duration-150 shadow-sm"
            >
              Perbarui Restoran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
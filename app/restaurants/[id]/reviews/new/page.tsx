import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function NewReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  async function createReview(formData: FormData) {
    "use server";

    const reviewerName = formData.get("reviewerName")?.toString();
    const rating = parseInt(formData.get("rating")?.toString() || "0");
    const comment = formData.get("comment")?.toString();

    if (!reviewerName || !rating || !comment) return;

    await prisma.review.create({
      data: {
        reviewerName,
        rating,
        comment,
        restaurantId: id,
      },
    });

    redirect(`/restaurants/${id}`);
  }

  // Preload restaurant name for header text
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    select: { name: true }
  });

  if (!restaurant) {
    redirect("/");
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
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Tambah Ulasan</h1>
          <p className="text-xs text-zinc-450 mt-1">Bagikan pengalaman kuliner Anda di {restaurant.name}.</p>
        </div>

        <form action={createReview} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nama Anda</label>
            <input 
              type="text" 
              name="reviewerName" 
              placeholder="Masukkan nama pengulas"
              className="w-full rounded-lg border border-zinc-200 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none transition-colors duration-150" 
              required 
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Rating</label>
            <div className="rating flex items-center gap-1 py-1">
              <input type="radio" name="rating" value="1" className="mask mask-star-2 bg-amber-400 cursor-pointer" required />
              <input type="radio" name="rating" value="2" className="mask mask-star-2 bg-amber-400 cursor-pointer" />
              <input type="radio" name="rating" value="3" className="mask mask-star-2 bg-amber-400 cursor-pointer" />
              <input type="radio" name="rating" value="4" className="mask mask-star-2 bg-amber-400 cursor-pointer" />
              <input type="radio" name="rating" value="5" className="mask mask-star-2 bg-amber-400 cursor-pointer" defaultChecked />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Ulasan Anda</label>
            <textarea 
              name="comment" 
              rows={4}
              placeholder="Bagaimana cita rasa makanan, pelayanan, dan suasana tempat ini? Tulis secara jujur..."
              className="w-full rounded-lg border border-zinc-200 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none transition-colors duration-150 resize-none" 
              required
            ></textarea>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <Link 
              href={`/restaurants/${id}`} 
              className="flex-1 inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-55 transition-colors"
            >
              Batal
            </Link>
            <button 
              type="submit" 
              className="flex-1 inline-flex items-center justify-center rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-850 active:scale-95 transition-all duration-150 shadow-sm"
            >
              Simpan Ulasan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


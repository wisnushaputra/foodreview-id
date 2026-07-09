import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function EditReviewPage({ params }: { params: Promise<{ id: string; reviewId: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const reviewId = resolvedParams.reviewId;

  async function loadReview(restaurantId: string, reviewId: string) {
    'use server';
    return await prisma.review.findFirst({
      where: { id: reviewId, restaurantId: restaurantId },
    });
  }

  async function updateReview(formData: FormData) {
    "use server";
    const reviewerName = formData.get("reviewerName")?.toString();
    const rating = parseInt(formData.get("rating")?.toString() || "0");
    const comment = formData.get("comment")?.toString();

    if (!reviewerName || !rating || !comment) return;

    await prisma.review.update({
      where: { id: reviewId },
      data: {
        reviewerName,
        rating,
        comment,
      },
    });

    redirect(`/restaurants/${id}`);
  }

  // Preload existing review data
  const review = await loadReview(id, reviewId);

  if (!review) {
    return (
      <main className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-semibold text-zinc-800">Ulasan tidak ditemukan</h2>
        <Link href={`/restaurants/${id}`} className="text-sm font-medium text-zinc-950 underline hover:text-zinc-700">
          Kembali ke Detail Restoran
        </Link>
      </main>
    );
  }

  // Preload restaurant name for header text
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    select: { name: true }
  });

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Back Button */}
      <div>
        <Link href={`/restaurants/${id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-800 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Detail
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-200/50 bg-white p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Edit Ulasan</h1>
          <p className="text-xs text-zinc-500 mt-1">Ubah ulasan Anda untuk {restaurant?.name || "restoran ini"}.</p>
        </div>

        <form action={updateReview} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nama Anda</label>
            <input 
              type="text" 
              name="reviewerName" 
              defaultValue={review.reviewerName || ""}
              className="w-full rounded-lg border border-zinc-200 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none transition-colors duration-150" 
              required 
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Rating</label>
            <div className="rating flex items-center gap-1 py-1">
              {[1, 2, 3, 4, 5].map((val) => (
                <input 
                  key={val}
                  type="radio" 
                  name="rating" 
                  value={val} 
                  className="mask mask-star-2 bg-amber-400 cursor-pointer" 
                  defaultChecked={review.rating === val}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Ulasan Anda</label>
            <textarea 
              name="comment" 
              rows={4}
              defaultValue={review.comment || ""}
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
              Perbarui Ulasan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
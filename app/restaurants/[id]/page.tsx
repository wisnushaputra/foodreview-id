import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteButton from "@/app/components/DeleteButton";

interface RestaurantDetailProps {
  params: Promise<{ id: string }>;
}

async function getRestaurant(id: string) {
  return await prisma.restaurant.findUnique({
    where: { id },
    include: {
      reviews: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export default async function RestaurantDetailPage({ params }: RestaurantDetailProps) {
  const resolvedParams = await params;
  const restaurant = await getRestaurant(resolvedParams.id);

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

  // Server Action untuk menghapus restoran
  async function deleteRestaurant() {
    "use server";
    try {
      await prisma.restaurant.delete({
        where: { id: resolvedParams.id },
      });
    } catch (e) {
      console.error("Gagal menghapus restoran:", e);
    }
    redirect("/?success=restaurant_deleted");
  }

  // Server Action untuk menghapus ulasan
  async function deleteReview(formData: FormData) {
    "use server";
    const reviewId = formData.get("reviewId")?.toString();
    if (!reviewId) return;

    try {
      await prisma.review.delete({
        where: { id: reviewId },
      });
    } catch (e) {
      console.error("Gagal menghapus ulasan:", e);
    }
    redirect(`/restaurants/${resolvedParams.id}?success=review_deleted`);
  }

  // Helper untuk merender bintang SVG
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => {
          const isFilled = i < rating;
          return (
            <svg
              key={i}
              className={`w-3.5 h-3.5 ${isFilled ? "text-amber-400 fill-amber-400" : "text-zinc-200 fill-zinc-100"}`}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        })}
      </div>
    );
  };

  // Hitung rating rata-rata
  const averageRating = restaurant.reviews.length > 0
    ? restaurant.reviews.reduce((sum, r) => sum + r.rating, 0) / restaurant.reviews.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-800 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>

      {/* Asymmetric Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Restaurant Main Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="overflow-hidden rounded-xl border border-zinc-200/50 bg-white shadow-sm">
            {/* Image section */}
            <div className="h-64 w-full bg-zinc-150 relative">
              {restaurant.imageUrl ? (
                <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-50 text-zinc-500">
                  <svg className="w-12 h-12 stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Details */}
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
                  📍 {restaurant.location}
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 mt-1">{restaurant.name}</h1>
              </div>

              <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm whitespace-pre-line border-t border-zinc-100 pt-4">
                {restaurant.description}
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-zinc-100 flex items-center gap-3">
                <Link 
                  href={`/restaurants/${resolvedParams.id}/edit`} 
                  className="flex-1 inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-55 hover:border-zinc-300 transition-colors shadow-sm"
                >
                  Edit Tempat
                </Link>
                <form action={deleteRestaurant} className="flex-1">
                  <DeleteButton 
                    confirmMessage="Apakah Anda yakin ingin menghapus restoran ini? Semua ulasan juga akan dihapus."
                    className="w-full inline-flex items-center justify-center rounded-lg bg-rose-50 hover:bg-rose-100/70 border border-rose-100 text-rose-650 px-4 py-2 text-sm font-semibold transition-colors"
                  >
                    Hapus
                  </DeleteButton>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Reviews and Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between gap-4 border-b border-zinc-150 pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">Ulasan Komunitas</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{restaurant.reviews.length} ulasan dari pengunjung.</p>
            </div>
            
            <Link 
              href={`/restaurants/${resolvedParams.id}/reviews/new`} 
              className="inline-flex items-center justify-center rounded-lg bg-zinc-950 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-850 active:scale-95 transition-all duration-150 shadow-sm"
            >
              Tulis Ulasan
            </Link>
          </div>

          {/* Average Rating Block */}
          {restaurant.reviews.length > 0 && (
            <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200/50 bg-zinc-50/50">
              <div className="text-3xl font-black text-zinc-900">{averageRating.toFixed(1)}</div>
              <div className="space-y-1">
                {renderStars(averageRating)}
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Rating rata-rata dari seluruh ulasan</div>
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {restaurant.reviews.length > 0 ? (
              restaurant.reviews.map((review) => (
                <div key={review.id} className="p-5 rounded-xl border border-zinc-200/50 bg-white space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar Placeholder */}
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 font-bold text-sm border border-zinc-200/40">
                        {review.reviewerName.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900">{review.reviewerName}</h4>
                        <span className="text-[10px] text-zinc-400" suppressHydrationWarning>
                          {new Date(review.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>

                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed pl-12 whitespace-pre-line">
                    {review.comment}
                  </p>

                  {/* Review Actions */}
                  <div className="pl-12 flex items-center gap-3 text-xs pt-1">
                    <Link 
                      href={`/restaurants/${resolvedParams.id}/reviews/${review.id}/edit`} 
                      className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-medium"
                    >
                      Edit
                    </Link>
                    <span className="text-zinc-200">|</span>
                    <form action={deleteReview} className="inline">
                      <input type="hidden" name="reviewId" value={review.id} />
                      <DeleteButton 
                        confirmMessage="Apakah Anda yakin ingin menghapus ulasan ini?"
                        className="text-rose-500 hover:text-rose-600 transition-colors font-medium cursor-pointer"
                      >
                        Hapus
                      </DeleteButton>
                    </form>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border border-dashed border-zinc-200 rounded-xl bg-white space-y-2">
                <svg className="w-8 h-8 text-zinc-350 mx-auto stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm text-zinc-500">Belum ada ulasan untuk restoran ini.</p>
                <p className="text-xs text-zinc-400">Jadilah yang pertama untuk membagikan ulasan Anda!</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}


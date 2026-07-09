import prisma from "@/lib/prisma";
import Link from "next/link";

interface Review {
  rating: number;
}

const dummyRestaurants = [
  { id: "1", name: "Sate Khas Senayan", location: "Jakarta", reviews: [{ rating: 5 }, { rating: 4 }] },
  { id: "2", name: "Warung Nasi Ampera", location: "Bandung", reviews: [{ rating: 5 }] },
  { id: "3", name: "Ketoprak Pak Joko Kaki Lima", location: "Jakarta", reviews: [{ rating: 5 }, { rating: 4 }] },
  { id: "4", name: "Nasi Goreng Gila Gondrong", location: "Jakarta", reviews: [{ rating: 5 }] },
  { id: "5", name: "Batagor H. Isan Khas Bandung", location: "Bandung", reviews: [{ rating: 5 }] },
  { id: "6", name: "Bakso Solo Mas Dino", location: "Solo", reviews: [{ rating: 5 }, { rating: 4 }] }
];

async function getStats() {
  try {
    const dbRestaurants = await prisma.restaurant.findMany({
      include: { reviews: true }
    });

    if (dbRestaurants.length === 0) {
      // Hitung fallback dari data dummy
      return calculateFallbackStats();
    }

    const totalRestaurants = dbRestaurants.length;
    const totalReviews = dbRestaurants.reduce((sum, r) => sum + r.reviews.length, 0);
    
    let avgRating = 0;
    if (totalReviews > 0) {
      const sumRating = dbRestaurants.reduce((sum, r) => sum + r.reviews.reduce((s, rev) => s + rev.rating, 0), 0);
      avgRating = sumRating / totalReviews;
    }

    // Hitung distribusi lokasi
    const locationMap: Record<string, number> = {};
    dbRestaurants.forEach((r) => {
      const loc = r.location.trim();
      locationMap[loc] = (locationMap[loc] || 0) + 1;
    });

    const locationDistribution = Object.entries(locationMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const busiestLocation = locationDistribution[0]?.name || "-";

    // Ambil 3 ulasan terbaru
    const latestReviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { restaurant: { select: { name: true } } }
    });

    const mappedLatestReviews = latestReviews.map(r => ({
      id: r.id,
      reviewerName: r.reviewerName,
      rating: r.rating,
      comment: r.comment,
      restaurantName: r.restaurant.name,
      restaurantId: r.restaurantId,
      createdAt: r.createdAt
    }));

    return {
      totalRestaurants,
      totalReviews,
      avgRating,
      busiestLocation,
      locationDistribution,
      latestReviews: mappedLatestReviews,
      isDemo: false
    };

  } catch (error) {
    console.error("Gagal mengambil data statistik dari database:", error);
    return calculateFallbackStats();
  }
}

function calculateFallbackStats() {
  const totalRestaurants = dummyRestaurants.length;
  const totalReviews = dummyRestaurants.reduce((sum, r) => sum + r.reviews.length, 0);
  const sumRating = dummyRestaurants.reduce((sum, r) => sum + r.reviews.reduce((s, rev) => s + rev.rating, 0), 0);
  const avgRating = sumRating / totalReviews;

  const locationMap: Record<string, number> = {};
  dummyRestaurants.forEach((r) => {
    locationMap[r.location] = (locationMap[r.location] || 0) + 1;
  });

  const locationDistribution = Object.entries(locationMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const busiestLocation = locationDistribution[0]?.name || "-";

  // Data ulasan dummy terbaru
  const latestReviews = [
    { id: "r8", reviewerName: "Fajar", rating: 5, comment: "Kuah kaldunya gurih alami, tetelannya melimpah ruah dan baksonya kenyal jos.", restaurantName: "Bakso Solo Mas Dino", restaurantId: "6", createdAt: new Date() },
    { id: "r7", reviewerName: "Rina", rating: 5, comment: "Batagor paling otentik di Bandung, ikannya terasa banget dan bumbunya pas.", restaurantName: "Batagor H. Isan Khas Bandung", restaurantId: "5", createdAt: new Date() },
    { id: "r6", reviewerName: "Rudi", rating: 5, comment: "Porsi gila melimpah! Rasanya manis gurih pas di lidah kuliner malam.", restaurantName: "Nasi Goreng Gila Gondrong", restaurantId: "4", createdAt: new Date() }
  ];

  return {
    totalRestaurants,
    totalReviews,
    avgRating,
    busiestLocation,
    locationDistribution,
    latestReviews,
    isDemo: true
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => {
          const isFilled = i < Math.round(rating);
          return (
            <svg
              key={i}
              className={`w-3.5 h-3.5 ${isFilled ? "text-amber-400 fill-amber-400" : "text-zinc-200 dark:text-zinc-800 fill-zinc-100 dark:fill-zinc-900/50"}`}
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

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-150 dark:border-zinc-850 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard & Statistik</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Ringkasan aktivitas dan persebaran data kuliner di komunitas FoodReview ID.</p>
        </div>
        {stats.isDemo && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-900/50 self-start sm:self-auto font-medium">
            Mode Demo
          </span>
        )}
      </div>

      {/* Grid Metrik Utama */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metrik 1: Total Restoran */}
        <div className="rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/40 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Restoran</span>
            <svg className="w-5 h-5 stroke-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-zinc-50">{stats.totalRestaurants}</div>
          <p className="text-[10px] text-zinc-400">Tempat kuliner terdaftar</p>
        </div>

        {/* Metrik 2: Total Ulasan */}
        <div className="rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/40 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Ulasan</span>
            <svg className="w-5 h-5 stroke-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-zinc-50">{stats.totalReviews}</div>
          <p className="text-[10px] text-zinc-400">Review jujur diterbitkan</p>
        </div>

        {/* Metrik 3: Rata-rata Rating */}
        <div className="rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/40 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Rata-rata Rating</span>
            <svg className="w-5 h-5 stroke-1.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
            {stats.avgRating > 0 ? stats.avgRating.toFixed(2) : "0.00"}
          </div>
          <p className="text-[10px] text-zinc-400">Skor dari skala 5 bintang</p>
        </div>

        {/* Metrik 4: Kota Teraktif */}
        <div className="rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/40 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Kota Teraktif</span>
            <svg className="w-5 h-5 stroke-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-zinc-50 truncate pt-1">{stats.busiestLocation}</div>
          <p className="text-[10px] text-zinc-400">Wilayah dengan cabang terbanyak</p>
        </div>
      </div>

      {/* Baris Kedua: Ulasan Terkini vs Distribusi Wilayah */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Kolom Kiri: Ulasan Terkini (8 Kolom) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl bg-white dark:bg-zinc-900/40 p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Ulasan Terbaru</h2>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {stats.latestReviews.length > 0 ? (
                stats.latestReviews.map((review) => (
                  <div key={review.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{review.reviewerName}</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          Mengulas{" "}
                          <Link href={`/restaurants/${review.restaurantId}`} className="text-zinc-800 dark:text-zinc-200 underline font-semibold hover:text-zinc-950">
                            {review.restaurantName}
                          </Link>
                        </p>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-350 leading-relaxed italic whitespace-pre-line pl-1.5 border-l-2 border-zinc-200 dark:border-zinc-800">
                      "{review.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-zinc-400">
                  Belum ada ulasan yang masuk ke database.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Distribusi Wilayah (4 Kolom) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl bg-white dark:bg-zinc-900/40 p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Persebaran Wilayah</h2>
            
            <div className="space-y-4">
              {stats.locationDistribution.map((loc) => {
                const percentage = (loc.count / stats.totalRestaurants) * 100;
                return (
                  <div key={loc.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-zinc-800 dark:text-zinc-200">📍 {loc.name}</span>
                      <span className="text-zinc-500 dark:text-zinc-400">{loc.count} Restoran</span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                      <div
                        className="bg-zinc-950 dark:bg-zinc-200 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

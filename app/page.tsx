import Link from "next/link";
import prisma from "@/lib/prisma";

const dummyRestaurants = [
  {
    id: "1",
    name: "Sate Khas Senayan",
    description: "Restoran legendaris dengan berbagai variasi sate otentik dan masakan khas Jawa Barat & Jawa Tengah.",
    location: "Jakarta",
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500&auto=format&fit=crop",
    reviews: [
      { id: "r1", reviewerName: "Budi", rating: 5, comment: "Sate kambing dan sate ayam bumbu kacangnya juara!" },
      { id: "r2", reviewerName: "Ani", rating: 4, comment: "Tempat bersih dan nyaman, pelayanannya sangat cepat." },
    ],
  },
  {
    id: "2",
    name: "Warung Nasi Ampera",
    description: "Destinasi kuliner masakan Sunda otentik dengan konsep prasmanan dan sambal khas Sunda dadakan.",
    location: "Bandung",
    imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=500&auto=format&fit=crop",
    reviews: [
      { id: "r3", reviewerName: "Citra", rating: 5, comment: "Sambal dadakan dan ayam goreng basahnya juara umum!" },
    ],
  },
  {
    id: "3",
    name: "Ketoprak Pak Joko Kaki Lima",
    description: "Ketoprak legendaris pinggir jalan dengan racikan bumbu kacang ulek halus gurih, tahu goreng hangat, tauge segar, dan kerupuk melimpah.",
    location: "Jakarta",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=500&auto=format&fit=crop",
    reviews: [
      { id: "r4", reviewerName: "Dedi", rating: 5, comment: "Bumbu kacangnya medok banget, bisa request tingkat kepedasan!" },
      { id: "r5", reviewerName: "Lia", rating: 4, comment: "Antreannya lumayan rame pas jam makan siang, tapi worth it banget." },
    ],
  },
  {
    id: "4",
    name: "Nasi Goreng Gila Gondrong",
    description: "Kuliner malam kaki lima ikonik yang menyajikan nasi goreng gila dengan siraman topping bakso, sosis, telur orak-arik, dan ayam bumbu pedas manis gurih.",
    location: "Jakarta",
    imageUrl: "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?q=80&w=500&auto=format&fit=crop",
    reviews: [
      { id: "r6", reviewerName: "Rudi", rating: 5, comment: "Porsi gila melimpah! Rasanya manis gurih pas di lidah kuliner malam." },
    ],
  },
  {
    id: "5",
    name: "Batagor H. Isan Khas Bandung",
    description: "Kedai batagor legendaris dengan cita rasa baso tahu goreng ikan tenggiri asli yang renyah dan disiram kuah kacang kental wangi jeruk limau.",
    location: "Bandung",
    imageUrl: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=500&auto=format&fit=crop",
    reviews: [
      { id: "r7", reviewerName: "Rina", rating: 5, comment: "Batagor paling otentik di Bandung, ikannya terasa banget dan bumbunya pas." },
    ],
  },
  {
    id: "6",
    name: "Bakso Solo Mas Dino",
    description: "Warung bakso kaki lima Solo legendaris yang terkenal dengan bakso urat super kenyal, limpahan tetelan sapi gurih, dan kuah kaldu bening segar.",
    location: "Solo",
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=500&auto=format&fit=crop",
    reviews: [
      { id: "r8", reviewerName: "Fajar", rating: 5, comment: "Kuah kaldunya gurih alami, tetelannya melimpah ruah dan baksonya kenyal jos." },
      { id: "r9", reviewerName: "Tari", rating: 4, comment: "Bakso uratnya juara! Tempatnya ramai terus." },
    ],
  },
];

async function getRestaurants() {
  try {
    let list = await prisma.restaurant.findMany({
      include: {
        reviews: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Jika database kosong, lakukan seeding data dummy agar bisa diklik dan dilihat detail/ulasannya
    if (list.length === 0) {
      console.log("Seeding data dummy ke database...");
      try {
        for (const r of dummyRestaurants) {
          await prisma.restaurant.create({
            data: {
              id: r.id,
              name: r.name,
              description: r.description,
              location: r.location,
              imageUrl: r.imageUrl,
              reviews: {
                create: r.reviews.map((rev) => ({
                  id: rev.id,
                  reviewerName: rev.reviewerName,
                  rating: rev.rating,
                  comment: rev.comment,
                })),
              },
            },
          });
        }
        // Ambil ulang dari database setelah seeding
        list = await prisma.restaurant.findMany({
          include: {
            reviews: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } catch (seedError) {
        console.error("Gagal melakukan seeding data dummy:", seedError);
      }
    }
    return list;
  } catch (error) {
    console.error("Gagal mengambil data dari database:", error);
    return [];
  }
}

export default async function Home() {
  const dbRestaurants = await getRestaurants();
  // Jika database offline/error, gunakan dummyRestaurants langsung dari memory
  const restaurants = dbRestaurants.length > 0 ? dbRestaurants : dummyRestaurants;


  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => {
          const isFilled = i < Math.round(rating);
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

  const getAverageRating = (reviews: { rating: number }[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return total / reviews.length;
  };

  return (
    <div className="space-y-12">
      {/* Premium Minimal Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-zinc-200/50 bg-gradient-to-b from-zinc-50 to-white p-8 md:p-12 lg:p-16">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-amber-150/30 blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-zinc-100 blur-3xl"></div>
        
        <div className="relative max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 leading-tight">
            Jelajahi Kuliner,<br />Bagikan Pengalaman Anda.
          </h1>
          <p className="mt-4 text-base md:text-lg text-zinc-500 font-light leading-relaxed">
            Temukan destinasi kuliner terfavorit di Indonesia dan bagikan ulasan jujur Anda bersama komunitas kami.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link 
              href="/restaurants/new" 
              className="inline-flex items-center justify-center rounded-lg bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-850 active:scale-95 transition-all duration-150 shadow-sm"
            >
              Tambah Restoran
            </Link>
            <a 
              href="#restoran-pilihan" 
              className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-650 hover:bg-zinc-50 active:scale-95 transition-all duration-150"
            >
              Lihat Semua
            </a>
          </div>
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <main id="restoran-pilihan" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-zinc-150 pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Restoran Pilihan</h2>
            <p className="text-sm text-zinc-400 mt-1">Daftar restoran pilihan yang dikurasi oleh para penikmat kuliner.</p>
          </div>
          {dbRestaurants.length === 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-medium border border-amber-200/50 self-start md:self-auto">
              Mode Demo (Database Kosong)
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((r) => {
            const avgRating = getAverageRating(r.reviews);
            return (
              <div 
                key={r.id} 
                className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200/60 bg-white hover:border-zinc-350 transition-all duration-300"
              >
                {/* Image Container with Hover Effect */}
                <div className="card-img-container bg-zinc-100">
                  {r.imageUrl ? (
                    <img 
                      src={r.imageUrl} 
                      alt={r.name} 
                      className="w-full h-full object-cover" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-50 text-zinc-400">
                      <svg className="w-8 h-8 stroke-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-zinc-900 shadow-sm backdrop-blur-sm border border-zinc-150">
                      📍 {r.location}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow p-5 space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-zinc-900 group-hover:text-zinc-950 transition-colors">
                      {r.name}
                    </h3>
                  </div>

                  <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed flex-grow">
                    {r.description}
                  </p>

                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-4 mt-auto">
                    {/* Stars and Review Count */}
                    <div className="flex items-center gap-2">
                      {renderStars(avgRating)}
                      <span className="text-xs font-medium text-zinc-400">
                        {avgRating > 0 ? avgRating.toFixed(1) : "-"} ({r.reviews.length})
                      </span>
                    </div>

                    <Link 
                      href={`/restaurants/${r.id}`} 
                      className="inline-flex items-center justify-center rounded-lg bg-zinc-50 group-hover:bg-zinc-950 px-3.5 py-1.5 text-xs font-semibold text-zinc-700 group-hover:text-white transition-all duration-200"
                    >
                      Detail
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}


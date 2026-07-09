import Link from "next/link";
import prisma from "@/lib/prisma";
import RestaurantList from "@/app/components/RestaurantList";

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

  return (
    <div className="space-y-12">
      {/* Premium Minimal Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 p-8 md:p-12 lg:p-16">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-zinc-100 dark:bg-zinc-800/10 blur-3xl"></div>
        
        <div className="relative max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            Jelajahi Kuliner,<br />Bagikan Pengalaman Anda.
          </h1>
          <p className="mt-4 text-base md:text-lg text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
            Temukan destinasi kuliner terfavorit di Indonesia dan bagikan ulasan jujur Anda bersama komunitas kami.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link 
              href="/restaurants/new" 
              className="inline-flex items-center justify-center rounded-lg bg-zinc-950 dark:bg-zinc-50 px-5 py-2.5 text-sm font-semibold text-white dark:text-zinc-950 hover:bg-zinc-850 dark:hover:bg-zinc-200 active:scale-95 transition-all duration-150 shadow-sm"
            >
              Tambah Restoran
            </Link>
            <a 
              href="#restoran-pilihan" 
              className="inline-flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-650 dark:text-zinc-300 hover:bg-zinc-55 dark:hover:bg-zinc-800 active:scale-95 transition-all duration-150"
            >
              Lihat Semua
            </a>
          </div>
        </div>
      </section>

      {/* Grid pencarian dan daftar restoran via Client Component */}
      <RestaurantList initialRestaurants={restaurants} isDemo={dbRestaurants.length === 0} />
    </div>
  );
}


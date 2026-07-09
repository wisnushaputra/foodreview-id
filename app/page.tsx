import Link from "next/link";
import prisma from "../lib/prisma";

async function getRestaurants() {
  return await prisma.restaurant.findMany();
}

export default async function Home() {
  const restaurants = await getRestaurants();

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-6">FoodReview ID</h1>
      <Link href="/restaurants/new" className="btn btn-primary mb-6">Tambah Restoran</Link>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {restaurants.map((r: any) => (
          <div key={r.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{r.name}</h2>
              <p>{r.location}</p>
              <div className="card-actions justify-end">
                <Link href={`/restaurants/${r.id}`} className="btn btn-sm btn-outline">Lihat Detail</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

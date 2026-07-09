import prisma from "../lib/prisma";
import Link from "next/link";

interface RestaurantDetailProps {
  params: { id: string };
}

async function getRestaurant(id: string) {
  return await prisma.restaurant.findUnique({
    where: { id },
    include: { reviews: true },
  });
}

export default async function RestaurantDetailPage({ params }: RestaurantDetailProps) {
  const restaurant = await getRestaurant(params.id);

  if (!restaurant) {
    return <main className="p-8">Restoran tidak ditemukan</main>;
  }

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-4">{restaurant.name}</h1>
      <p className="text-lg mb-6">{restaurant.location}</p>
      <p className="mb-6">{restaurant.description}</p>
      
      {restaurant.imageUrl && (
        <img src={restaurant.imageUrl} alt={restaurant.name} className="mb-6 rounded-lg shadow-md max-w-xs" />
      )}

      <div className="divider">Ulasan</div>

      <div className="mt-6 space-y-4">
        {restaurant.reviews?.length > 0 ? (
          restaurant.reviews.map((review: any) => (
            <div key={review.id} className="card bg-base-200 shadow-sm">
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{review.reviewerName}</h3>
                  <div className="rating rating-half">
                    {Array.from({ length: 5 }, (_, i) => (
                      <input
                        key={i}
                        type="radio"
                        name={`rating-${review.id}`}
                        className={`bg-warning mask mask-star-2 ${i < review.rating ? 'checked' : ''}`}
                        checked={i + 1 === review.rating} // Simple way to check, might need adjustment for half stars
                      />
                    ))}
                  </div>
                </div>
                <p>{review.comment}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Belum ada ulasan untuk restoran ini.</p>
        )}
      </div>

      <div className="mt-8 flex space-x-4">
        <Link href={`/restaurants/${params.id}/edit`} className="btn btn-secondary">Edit Restoran</Link>
        <Link href={`/restaurants/${params.id}/reviews/new`} className="btn btn-primary">Tambah Ulasan</Link>
      </div>
    </main>
  );
}

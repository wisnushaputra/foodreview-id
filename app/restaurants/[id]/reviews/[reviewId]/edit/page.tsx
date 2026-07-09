import { redirect } from "next/navigation";
import prisma from "../../../../lib/prisma";

export default function EditReviewPage({ params }: { params: { id: string; reviewId: string } }) {
  async function loadReview(restaurantId: string, reviewId: string) {
    'use server';
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();
    return await prisma.review.findFirst({
      where: { id: reviewId, restaurantId: restaurantId },
    });
  }

  async function updateReview(formData: FormData) {
    "use server";
    const restaurantId = params.id;
    const reviewId = params.reviewId;
    const reviewerName = formData.get("reviewerName")?.toString();
    const rating = parseInt(formData.get("rating")?.toString() || "0");
    const comment = formData.get("comment")?.toString();

    if (!reviewerName || !rating || !comment) return;

    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();

    await prisma.review.update({
      where: { id: reviewId },
      data: {
        reviewerName,
        rating,
        comment,
      },
    });

    redirect(`/restaurants/${restaurantId}`);
  }

  // Preload existing review data
  const review = await loadReview(params.id, params.reviewId);

  if (!review) {
    return <main className="p-8">Ulasan tidak ditemukan</main>;
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Ulasan</h1>
      <form action={updateReview} className="form-control w-full max-w-lg">
        <label className="label"><span className="label-text">Nama Pengulas</span></label>
        <input type="text" name="reviewerName" className="input input-bordered w-full mb-4" value={review.reviewerName || ""} required />

        <label className="label"><span className="label-text">Rating (1-5)</span></label>
        <input type="number" name="rating" min="1" max="5" className="input input-bordered w-full mb-4" value={review.rating || ""} required />

        <label className="label"><span className="label-text">Komentar</span></label>
        <textarea name="comment" className="textarea textarea-bordered w-full mb-6" value={review.comment || ""} required></textarea>
        
        <button type="submit" className="btn btn-primary">Perbarui Ulasan</button>
      </form>
    </main>
  );
}
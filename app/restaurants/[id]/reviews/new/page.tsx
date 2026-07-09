import { redirect } from "next/navigation";
import prisma from "../../../../lib/prisma";

export default function NewReviewPage({ params }: { params: { id: string } }) {
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
        restaurantId: params.id,
      },
    });

    redirect(`/restaurants/${params.id}`);
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Tambah Ulasan</h1>
      <form action={createReview} className="form-control w-full max-w-lg">
        <label className="label"><span className="label-text">Nama Pengulas</span></label>
        <input type="text" name="reviewerName" className="input input-bordered w-full mb-4" required />
        
        <label className="label"><span className="label-text">Rating (1-5)</span></label>
        <input type="number" name="rating" min="1" max="5" className="input input-bordered w-full mb-4" required />
        
        <label className="label"><span className="label-text">Komentar</span></label>
        <textarea name="comment" className="textarea textarea-bordered w-full mb-6" required></textarea>
        
        <button type="submit" className="btn btn-primary">Simpan Ulasan</button>
      </form>
    </main>
  );
}

import { redirect } from "next/navigation";

export default function NewRestaurantPage() {
  async function createRestaurant(formData: FormData) {
    "use server";

    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const location = formData.get("location")?.toString();
    const imageUrl = formData.get("imageUrl")?.toString();

    if (!name || !description || !location) {
      return; // Handle error
    }

    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();

    await prisma.restaurant.create({
      data: {
        name,
        description,
        location,
        imageUrl,
      },
    });

    redirect("/");
  }

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-6">Tambah Restoran Baru</h1>
      <form action={createRestaurant} className="form-control w-full max-w-lg">
        <label className="label">
          <span className="label-text">Nama Restoran</span>
        </label>
        <input type="text" name="name" className="input input-bordered w-full mb-4" required />

        <label className="label">
          <span className="label-text">Deskripsi</span>
        </label>
        <textarea name="description" className="textarea textarea-bordered w-full mb-4" required></textarea>

        <label className="label">
          <span className="label-text">Lokasi</span>
        </label>
        <input type="text" name="location" className="input input-bordered w-full mb-4" required />

        <label className="label">
          <span className="label-text">URL Gambar (Opsional)</span>
        </label>
        <input type="text" name="imageUrl" className="input input-bordered w-full mb-6" />

        <button type="submit" className="btn btn-primary">Simpan Restoran</button>
      </form>
    </main>
  );
}

import { redirect } from "next/navigation";
import prisma from "../../../../lib/prisma";

export default function EditRestaurantPage({ params }: { params: { id: string } }) {
  async function loadRestaurant(id: string) {
    'use server';
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();
    return await prisma.restaurant.findUnique({ where: { id } });
  }

  async function updateRestaurant(formData: FormData) {
    "use server";
    const id = params.id;
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const location = formData.get("location")?.toString();
    const imageUrl = formData.get("imageUrl")?.toString();

    if (!name || !description || !location) return;

    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();

    await prisma.restaurant.update({
      where: { id },
      data: {
        name,
        description,
        location,
        imageUrl,
      },
    });

    redirect(`/restaurants/${id}`);
  }

  // Preload existing data
  const restaurant = await loadRestaurant(params.id);

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-6">Edit Restoran</h1>
      <form action={updateRestaurant} className="form-control w-full max-w-lg">
        <label className="label">
          <span className="label-text">Nama Restoran</span>
        </label>
        <input type="text" name="name" className="input input-bordered w-full mb-4" value={restaurant?.name || ""} required />

        <label className="label">
          <span className="label-text">Deskripsi</span>
        </label>
        <textarea name="description" className="textarea textarea-bordered w-full mb-4" value={restaurant?.description || ""} required></textarea>

        <label className="label">
          <span className="label-text">Lokasi</span>
        </label>
        <input type="text" name="location" className="input input-bordered w-full mb-4" value={restaurant?.location || ""} required />

        <label className="label">
          <span className="label-text">URL Gambar (Opsional)</span>
        </label>
        <input type="text" name="imageUrl" className="input input-bordered w-full mb-6" value={restaurant?.imageUrl || ""} />

        <button type="submit" className="btn btn-primary">Perbarui Restoran</button>
      </form>
    </main>
  );
}
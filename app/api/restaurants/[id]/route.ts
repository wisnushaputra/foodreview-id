import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.id },
    include: { reviews: true },
  });
  return NextResponse.json(restaurant);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const restaurant = await prisma.restaurant.update({
    where: { id: params.id },
    data: body,
  });
  return NextResponse.json(restaurant);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.restaurant.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Restaurant deleted" });
}

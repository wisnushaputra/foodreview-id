import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.id },
    include: { reviews: true },
  });
  return NextResponse.json(restaurant);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const body = await request.json();
  const restaurant = await prisma.restaurant.update({
    where: { id: params.id },
    data: body,
  });
  return NextResponse.json(restaurant);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  await prisma.restaurant.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Restaurant deleted" });
}

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const review = await prisma.review.create({
    data: {
      ...body,
      restaurantId: params.id,
    },
  });
  return NextResponse.json(review);
}

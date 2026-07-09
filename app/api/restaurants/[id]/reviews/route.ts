import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const body = await request.json();
  const params = await context.params;
  const review = await prisma.review.create({
    data: {
      ...body,
      restaurantId: params.id,
    },
  });
  return NextResponse.json(review);
}

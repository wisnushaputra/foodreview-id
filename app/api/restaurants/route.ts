import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const restaurants = await prisma.restaurant.findMany({ include: { reviews: true } });
  return NextResponse.json(restaurants);
}

export async function POST(request: Request) {
  const body = await request.json();
  const restaurant = await prisma.restaurant.create({ data: body });
  return NextResponse.json(restaurant);
}

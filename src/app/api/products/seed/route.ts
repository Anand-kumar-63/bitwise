import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { isDbConfigured } from "@/lib/env";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json({
      success: false,
      error:
        "MONGODB_URI is not configured. Products are served from mock data; seeding requires a database.",
    });
  }

  try {
    await connectDB();

    const count = await Product.countDocuments();
    if (count > 0) {
      return NextResponse.json({
        success: true,
        message: `Database already has ${count} products. Skipping seed.`,
      });
    }

    await Product.insertMany(MOCK_PRODUCTS);

    return NextResponse.json({
      success: true,
      message: `Seeded ${MOCK_PRODUCTS.length} products successfully.`,
    });
  } catch (error) {
    console.error("[API /products/seed]", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed products" },
      { status: 500 }
    );
  }
}

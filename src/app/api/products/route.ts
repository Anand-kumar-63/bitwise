import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { ApiResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const page = parseInt(searchParams.get("page") ?? "1");
    const featured = searchParams.get("featured") === "true";
    const bridal = searchParams.get("bridal") === "true";
    const sale = searchParams.get("sale") === "true";
    const q = searchParams.get("q");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (category) filter.category = category;
    if (featured) filter.isBestseller = true;
    if (bridal) filter.isBridal = true;
    if (sale) filter.originalPrice = { $exists: true };
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json<ApiResponse<{ products: unknown[]; total: number; page: number; pages: number }>>({
      success: true,
      data: {
        products,
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[API /products]", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

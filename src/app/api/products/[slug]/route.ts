import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { ApiResponse } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    await connectDB();
    const product = await Product.findOne({ slug }).lean();
    if (!product) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json<ApiResponse<unknown>>({ success: true, data: product });
  } catch (error) {
    console.error("[API /products/:slug]", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

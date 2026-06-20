import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";
import { ApiResponse } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    if (!product) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json<ApiResponse<unknown>>({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("[API /products/:slug]", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

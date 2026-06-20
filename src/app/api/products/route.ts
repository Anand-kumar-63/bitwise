import { NextRequest, NextResponse } from "next/server";
import { queryProducts } from "@/lib/products";
import { ApiResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const result = await queryProducts({
      category: searchParams.get("category"),
      limit: parseInt(searchParams.get("limit") ?? "20"),
      page: parseInt(searchParams.get("page") ?? "1"),
      featured: searchParams.get("featured") === "true",
      bridal: searchParams.get("bridal") === "true",
      sale: searchParams.get("sale") === "true",
      q: searchParams.get("q"),
    });

    return NextResponse.json<
      ApiResponse<{
        products: unknown[];
        total: number;
        page: number;
        pages: number;
      }>
    >({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("[API /products]", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

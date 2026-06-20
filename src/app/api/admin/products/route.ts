import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import {
  createProduct,
  deleteProduct,
  listAllProducts,
  updateProduct,
} from "@/lib/products";
import { ProductInput } from "@/types";

function unauthorized() {
  return NextResponse.json(
    { success: false, error: "Unauthorized" },
    { status: 401 }
  );
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  try {
    const products = await listAllProducts();
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("[API admin/products GET]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  try {
    const body = (await request.json()) as ProductInput;
    if (!body.name || !body.category || !body.price) {
      return NextResponse.json(
        { success: false, error: "Name, category, and price are required" },
        { status: 400 }
      );
    }

    const product = await createProduct({
      name: body.name,
      slug: body.slug,
      category: body.category,
      description: body.description ?? "",
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      images: body.images?.length ? body.images : ["/images/anarkali.png"],
      sizes: body.sizes?.length ? body.sizes : ["Free Size"],
      colors: body.colors?.length
        ? body.colors
        : [{ name: "Default", hex: "#c9a84c" }],
      fabric: body.fabric ?? "",
      occasion: body.occasion ?? [],
      tags: body.tags ?? [],
      rating: Number(body.rating ?? 4.5),
      reviewCount: Number(body.reviewCount ?? 0),
      stock: Number(body.stock ?? 0),
      isBestseller: Boolean(body.isBestseller),
      isNew: Boolean(body.isNew),
      isBridal: Boolean(body.isBridal),
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("[API admin/products POST]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  try {
    const body = await request.json();
    const { id, ...updates } = body as { id?: string } & Partial<ProductInput>;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product id is required" },
        { status: 400 }
      );
    }

    const product = await updateProduct(id, updates);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("[API admin/products PUT]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product id is required" },
        { status: 400 }
      );
    }

    const deleted = await deleteProduct(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API admin/products DELETE]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

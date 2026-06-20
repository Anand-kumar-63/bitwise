import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import {
  createOffer,
  deleteOffer,
  queryOffers,
  updateOffer,
} from "@/lib/offers";
import { OfferInput } from "@/types";

function unauthorized() {
  return NextResponse.json(
    { success: false, error: "Unauthorized" },
    { status: 401 }
  );
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  try {
    const offers = await queryOffers();
    return NextResponse.json({ success: true, data: offers });
  } catch (error) {
    console.error("[API admin/offers GET]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch offers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  try {
    const body = (await request.json()) as OfferInput;
    if (!body.title || !body.discountPercent || !body.scope) {
      return NextResponse.json(
        {
          success: false,
          error: "Title, discount percent, and scope are required",
        },
        { status: 400 }
      );
    }

    const offer = await createOffer({
      title: body.title,
      description: body.description ?? "",
      bannerText: body.bannerText || body.title,
      code: body.code,
      discountPercent: Number(body.discountPercent),
      scope: body.scope,
      category: body.category,
      productIds: body.productIds ?? [],
      isActive: body.isActive ?? true,
      startsAt: body.startsAt,
      endsAt: body.endsAt,
    });

    return NextResponse.json({ success: true, data: offer });
  } catch (error) {
    console.error("[API admin/offers POST]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create offer" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  try {
    const body = await request.json();
    const { id, ...updates } = body as { id?: string } & Partial<OfferInput>;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Offer id is required" },
        { status: 400 }
      );
    }

    const offer = await updateOffer(id, updates);
    if (!offer) {
      return NextResponse.json(
        { success: false, error: "Offer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: offer });
  } catch (error) {
    console.error("[API admin/offers PUT]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update offer" },
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
        { success: false, error: "Offer id is required" },
        { status: 400 }
      );
    }

    const deleted = await deleteOffer(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Offer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API admin/offers DELETE]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete offer" },
      { status: 500 }
    );
  }
}

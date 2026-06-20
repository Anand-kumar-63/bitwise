import { NextResponse } from "next/server";
import { getActiveOffers } from "@/lib/offers";

export async function GET() {
  try {
    const offers = await getActiveOffers();
    return NextResponse.json({ success: true, data: offers });
  } catch (error) {
    console.error("[API /offers]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch offers" },
      { status: 500 }
    );
  }
}

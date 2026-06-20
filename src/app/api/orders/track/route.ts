import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { isDbConfigured } from "@/lib/env";
import { ApiResponse, Order as IOrder } from "@/types";

// GET /api/orders/track?orderId=xxx&email=yyy
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId")?.trim();
    const email   = searchParams.get("email")?.trim().toLowerCase();

    if (!orderId || !email) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Order ID and email are required." },
        { status: 400 }
      );
    }

    // ── Demo / no-DB mode ──────────────────────────────────────────────────
    if (!isDbConfigured()) {
      // Return a realistic mock order so the UI is testable without MongoDB
      const mockOrder: IOrder = {
        _id: orderId,
        items: [
          {
            productId: "demo_001",
            name: "Champagne Anarkali Suit",
            image: "/images/anarkali.png",
            price: 18500,
            size: "M",
            color: "Champagne",
            quantity: 1,
          },
        ],
        subtotal: 18500,
        shipping: 0,
        tax: 925,
        total: 19425,
        shippingAddress: {
          firstName: "Demo",
          lastName: "Customer",
          email: email,
          phone: "9999999999",
          address: "123 Demo Street",
          city: "Lucknow",
          state: "Uttar Pradesh",
          pincode: "226001",
          country: "India",
        },
        status: "shipped",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      };
      return NextResponse.json<ApiResponse<{ order: IOrder }>>({
        success: true,
        data: { order: mockOrder },
      });
    }

    // ── Live DB lookup ─────────────────────────────────────────────────────
    await connectDB();

    // Support both Mongo _id and razorpay_order_id as the "order ID" the
    // customer might have (from the confirmation email / page).
    const query: Record<string, unknown> = {
      $or: [
        { razorpay_order_id: orderId },
        // Only try ObjectId match if it looks like one (24 hex chars)
        ...(orderId.length === 24 ? [{ _id: orderId }] : []),
      ],
      "shippingAddress.email": email,
    };

    const order = await Order.findOne(query).lean();

    if (!order) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "No order found with those details. Please check the Order ID and email." },
        { status: 404 }
      );
    }

    const serialized: IOrder = {
      // ...(order as Record<string, unknown>),
      _id: (order as { _id: { toString(): string } })._id.toString(),
      createdAt:
        (order as { createdAt?: Date }).createdAt?.toISOString() ??
        new Date().toISOString(),
    } as IOrder;

    return NextResponse.json<ApiResponse<{ order: IOrder }>>({
      success: true,
      data: { order: serialized },
    });
  } catch (error) {
    console.error("[API /orders/track]", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to fetch order." },
      { status: 500 }
    );
  }
}

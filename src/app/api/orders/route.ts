import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { razorpay } from "@/lib/razorpay";
import { ApiResponse, Order as IOrder } from "@/types";
import { SHIPPING_THRESHOLD, SHIPPING_COST, TAX_RATE } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shippingAddress } = body;

    if (!items?.length || !shippingAddress) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Missing items or shipping address" },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal: number = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + shipping + tax;

    await connectDB();

    // Create Razorpay order (will fail gracefully if keys are not set)
    let razorpay_order_id: string | undefined;
    try {
      const rzpOrder = await razorpay.orders.create({
        amount: total * 100, // paise
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
      });
      razorpay_order_id = rzpOrder.id;
    } catch (rzpErr) {
      console.warn("[Razorpay] Could not create order:", rzpErr);
    }

    // Persist order
    const order = await Order.create({
      items,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress,
      razorpay_order_id,
      status: "pending",
    });

    const serializedOrder: IOrder = {
      ...order.toObject(),
      _id: order._id.toString(),
      createdAt: order.createdAt?.toISOString() ?? new Date().toISOString(),
    };

    return NextResponse.json<ApiResponse<{ order: IOrder; razorpay_order_id?: string; total: number }>>({
      success: true,
      data: {
        order: serializedOrder,
        razorpay_order_id,
        total,
      },
    });
  } catch (error) {
    console.error("[API /orders POST]", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}

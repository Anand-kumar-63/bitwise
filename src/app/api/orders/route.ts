import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getRazorpay } from "@/lib/razorpay";
import { isDbConfigured } from "@/lib/env";
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

    const subtotal: number = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + shipping + tax;

    let razorpay_order_id: string | undefined;
    const razorpay = getRazorpay();
    if (razorpay) {
      try {
        const rzpOrder = await razorpay.orders.create({
          amount: total * 100,
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
        });
        razorpay_order_id = rzpOrder.id;
      } catch (rzpErr) {
        console.warn("[Razorpay] Could not create order:", rzpErr);
      }
    }

    // Demo mode — no MONGODB_URI: return a fake order (COD flow on checkout)
    if (!isDbConfigured()) {
      const demoOrder: IOrder = {
        _id: `demo_${Date.now()}`,
        items,
        subtotal,
        shipping,
        tax,
        total,
        shippingAddress,
        razorpay_order_id,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json<
        ApiResponse<{ order: IOrder; razorpay_order_id?: string; total: number }>
      >({
        success: true,
        data: { order: demoOrder, razorpay_order_id, total },
      });
    }

    await connectDB();

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

    return NextResponse.json<
      ApiResponse<{ order: IOrder; razorpay_order_id?: string; total: number }>
    >({
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

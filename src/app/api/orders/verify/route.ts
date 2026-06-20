import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { ApiResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Missing payment verification data" },
        { status: 400 }
      );
    }

    // Verify HMAC signature
    const key_secret = process.env.RAZORPAY_KEY_SECRET ?? "";
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Payment verification failed" },
        { status: 400 }
      );
    }

    await connectDB();

    // Update order status
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        razorpay_payment_id,
        razorpay_signature,
        status: "paid",
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<{ orderId: string }>>({
      success: true,
      data: { orderId: order._id.toString() },
    });
  } catch (error) {
    console.error("[API /orders/verify]", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}

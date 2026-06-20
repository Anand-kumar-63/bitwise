import Razorpay from "razorpay";
import { env, isRazorpayConfigured } from "@/lib/env";

let razorpayInstance: Razorpay | null = null;

/** Returns a Razorpay client only when RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET are set. */
export function getRazorpay(): Razorpay | null {
  if (!isRazorpayConfigured()) {
    return null;
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: env.razorpayKeyId,
      key_secret: env.razorpayKeySecret,
    });
  }

  return razorpayInstance;
}

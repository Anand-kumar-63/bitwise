"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "—";
  const status = searchParams.get("status") ?? "pending";

  const isPaid = status === "paid";
  const isCod = status === "cod";

  return (
    <div className="min-h-screen bg-[#0a0806] flex items-center justify-center px-6 pt-20">
      <div className="max-w-[600px] w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center bg-[#c9a84c]/10 border border-[#c9a84c]/20">
          <CheckCircle size={40} className="text-[#c9a84c]" />
        </div>

        {/* Gold divider */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-16 bg-[#c9a84c]/40" />
          <span className="text-[0.65rem] tracking-[0.28em] uppercase text-[#c9a84c]">
            Order Confirmed
          </span>
          <div className="h-px w-16 bg-[#c9a84c]/40" />
        </div>

        <h1 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-medium text-[#f0e8dc] mb-4 leading-tight">
          Thank You for Your Order!
        </h1>
        <p className="text-[#8a7d6e] text-[1rem] leading-relaxed mb-8 max-w-[440px] mx-auto">
          {isPaid
            ? "Your payment was successful. We are carefully preparing your order with the same love that went into making it."
            : isCod
            ? "Your order has been placed successfully with Cash on Delivery. We'll contact you before dispatching."
            : "Your order has been received and is being processed."}
        </p>

        {/* Order ID */}
        <div className="bg-[#110e0a] border border-[#c9a84c]/12 rounded-none px-6 py-5 mb-8 inline-block w-full max-w-[380px]">
          <div className="text-[0.65rem] tracking-[0.2em] uppercase text-[#6b6258] mb-1">
            Order Reference
          </div>
          <div className="font-mono text-[#c9a84c] font-medium tracking-wider break-all">
            {orderId}
          </div>
          {isCod && (
            <div className="mt-3 inline-block bg-[#1a2a10]/80 text-[#6ab04c] text-[0.68rem] tracking-[0.1em] uppercase px-2.5 py-1 border border-[#6ab04c]/20">
              COD — Pay on Delivery
            </div>
          )}
          {isPaid && (
            <div className="mt-3 inline-block bg-[#c9a84c]/10 text-[#c9a84c] text-[0.68rem] tracking-[0.1em] uppercase px-2.5 py-1 border border-[#c9a84c]/20">
              ✓ Payment Successful
            </div>
          )}
        </div>

        {/* What's Next */}
        <div className="grid grid-cols-3 gap-4 mb-10 text-center">
          {[
            {
              icon: <Package size={20} className="text-[#c9a84c]" />,
              title: "Processing",
              desc: "1–2 business days",
            },
            {
              icon: "✈️",
              title: "Dispatch",
              desc: "2–3 business days",
            },
            {
              icon: "🎁",
              title: "Delivery",
              desc: "5–7 business days",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-[#110e0a] border border-[#c9a84c]/10 p-4 relative"
            >
              <div className="flex items-center justify-center mb-2 text-xl">
                {typeof s.icon === "string" ? s.icon : s.icon}
              </div>
              <div className="text-[0.72rem] font-semibold text-[#f0e8dc] tracking-wide">{s.title}</div>
              <div className="text-[0.65rem] text-[#6b6258] mt-0.5">{s.desc}</div>
            </div>
          ))}
        </div>

        <p className="text-[#6b6258] text-sm mb-8">
          A confirmation email has been sent. For queries, contact{" "}
          <a href="mailto:hello@taaniakandpal.com" className="text-[#c9a84c] hover:underline">
            hello@taaniakandpal.com
          </a>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-[#c9a84c] text-[#0a0806] px-8 py-3.5 text-[0.78rem] font-semibold tracking-[0.12em] uppercase hover:bg-[#e8c96a] transition-all"
          >
            Continue Shopping <ArrowRight size={15} />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-[#c9a84c]/20 text-[#b8a898] px-8 py-3.5 text-[0.78rem] font-medium tracking-[0.12em] uppercase hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all"
          >
            <Home size={15} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0806] flex items-center justify-center text-[#c9a84c]">
          Loading…
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search, Package, Truck, CheckCircle2, Clock,
  XCircle, MapPin, Phone, Mail, ArrowRight, RotateCcw,
} from "lucide-react";
import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";

// ── Status pipeline ──────────────────────────────────────────────────────────
type OrderStatus = Order["status"];

const STATUS_STEPS: {
  key: OrderStatus;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    key: "pending",
    label: "Order Placed",
    description: "We've received your order and are preparing it.",
    icon: Clock,
  },
  {
    key: "paid",
    label: "Payment Confirmed",
    description: "Payment verified. Your items are being packed.",
    icon: CheckCircle2,
  },
  {
    key: "shipped",
    label: "Shipped",
    description: "Your order is on its way to you!",
    icon: Truck,
  },
  {
    key: "delivered",
    label: "Delivered",
    description: "Your order has been delivered. Enjoy!",
    icon: Package,
  },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  pending: 0,
  paid: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:   "text-[#c9a84c] bg-[#c9a84c]/10 border-[#c9a84c]/30",
  paid:      "text-[#4caf7d] bg-[#4caf7d]/10 border-[#4caf7d]/30",
  shipped:   "text-[#4a9fd4] bg-[#4a9fd4]/10 border-[#4a9fd4]/30",
  delivered: "text-[#4caf7d] bg-[#4caf7d]/10 border-[#4caf7d]/30",
  cancelled: "text-[#c4405a] bg-[#c4405a]/10 border-[#c4405a]/30",
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [order,   setOrder]   = useState<Order | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    try {
      const res  = await fetch(
        `/api/orders/track?orderId=${encodeURIComponent(orderId.trim())}&email=${encodeURIComponent(email.trim())}`
      );
      const json = await res.json();

      if (!json.success) {
        setError(json.error ?? "Order not found.");
      } else {
        setOrder(json.data.order as Order);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const currentStep = order ? STATUS_ORDER[order.status] : -1;

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-[#0d0a07] pt-36 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/4 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-24 w-px h-full bg-gradient-to-b from-transparent via-[#c9a84c]/10 to-transparent hidden lg:block" />
        <div className="absolute top-0 right-24 w-px h-full bg-gradient-to-b from-transparent via-[#c9a84c]/10 to-transparent hidden lg:block" />

        <div className="relative max-w-[1320px] mx-auto text-center">
          <span className="section-label mb-5 justify-center">Order Tracking</span>
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.8rem)] font-medium text-[#f0e8dc] mt-4 leading-tight">
            Track Your{" "}
            <em className="text-[#c9a84c] italic">Order</em>
          </h1>
          <p className="text-[#8a7d6e] mt-4 max-w-lg mx-auto text-[1rem] leading-relaxed">
            Enter your Order ID and the email address used at checkout to get a real-time update on your parcel.
          </p>
        </div>
      </section>

      {/* ── Search Form ── */}
      <section className="bg-[#0a0806] py-14 px-6">
        <div className="max-w-[680px] mx-auto">
          <form
            onSubmit={handleSearch}
            className="bg-[#110e0a] border border-[#c9a84c]/12 p-8"
            aria-label="Track order form"
          >
            <h2 className="font-serif text-[1.25rem] text-[#f0e8dc] mb-6">
              Enter Your Details
            </h2>

            <div className="space-y-4">
              {/* Order ID */}
              <div>
                <label
                  htmlFor="track-order-id"
                  className="block text-[0.68rem] uppercase tracking-[0.18em] text-[#c9a84c] mb-2"
                >
                  Order ID <span className="text-[#c4405a]">*</span>
                </label>
                <input
                  id="track-order-id"
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. AZB-2026-001234 or Razorpay order_xxx"
                  className="w-full bg-[#0a0806]/70 border border-[#c9a84c]/20 text-[#f0e8dc] placeholder-[#6b6258] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                />
                <p className="text-[0.68rem] text-[#6b6258] mt-1.5">
                  You can find this in your order confirmation email.
                </p>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="track-email"
                  className="block text-[0.68rem] uppercase tracking-[0.18em] text-[#c9a84c] mb-2"
                >
                  Email Address <span className="text-[#c4405a]">*</span>
                </label>
                <input
                  id="track-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email used at checkout"
                  className="w-full bg-[#0a0806]/70 border border-[#c9a84c]/20 text-[#f0e8dc] placeholder-[#6b6258] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 flex items-start gap-3 bg-[#c4405a]/8 border border-[#c4405a]/25 text-[#c4405a] px-4 py-3 text-sm">
                <XCircle size={16} className="mt-0.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              id="track-submit"
              type="submit"
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-2.5 bg-[#c9a84c] text-[#0a0806] py-4 text-[0.78rem] font-semibold tracking-[0.12em] uppercase hover:bg-[#e8c96a] transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-[0_8px_30px_rgba(201,168,76,0.35)] hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Searching…
                </>
              ) : (
                <>
                  <Search size={15} />
                  Track My Order
                </>
              )}
            </button>
          </form>

          {/* Help tip */}
          {!order && !error && (
            <p className="text-center text-[#6b6258] text-xs mt-5 leading-relaxed">
              Can&apos;t find your order?{" "}
              <a href="/contact" className="text-[#c9a84c] hover:underline">
                Contact our support team →
              </a>
            </p>
          )}
        </div>
      </section>

      {/* ── Results ── */}
      {order && (
        <section className="bg-[#0a0806] pb-20 px-6">
          <div className="max-w-[900px] mx-auto space-y-6">

            {/* ── Order Header ── */}
            <div className="bg-[#110e0a] border border-[#c9a84c]/12 p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div>
                <div className="text-[0.68rem] uppercase tracking-[0.18em] text-[#c9a84c] mb-1">
                  Order ID
                </div>
                <div className="font-serif text-[1.1rem] text-[#f0e8dc]">
                  {order._id}
                </div>
                <div className="text-[#6b6258] text-xs mt-1">
                  Placed on {formatDate(order.createdAt)}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-[0.68rem] uppercase tracking-[0.14em] font-semibold border px-3 py-1.5 ${STATUS_COLORS[order.status]}`}
                >
                  {order.status === "cancelled" ? "❌ Cancelled" : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <button
                  onClick={() => { setOrder(null); setOrderId(""); setEmail(""); }}
                  className="text-[0.68rem] uppercase tracking-[0.1em] text-[#8a7d6e] hover:text-[#c9a84c] transition-colors flex items-center gap-1"
                >
                  <RotateCcw size={12} /> New Search
                </button>
              </div>
            </div>

            {/* ── Status Timeline ── */}
            {order.status !== "cancelled" ? (
              <div className="bg-[#110e0a] border border-[#c9a84c]/12 p-7">
                <h2 className="font-serif text-[1.1rem] text-[#f0e8dc] mb-8">
                  Shipment Progress
                </h2>
                <div className="relative">
                  {/* Connector line */}
                  <div className="absolute left-[18px] top-5 bottom-5 w-px bg-[#c9a84c]/12 hidden sm:block" />

                  <ol className="space-y-8">
                    {STATUS_STEPS.map((step, idx) => {
                      const done    = idx <= currentStep;
                      const active  = idx === currentStep;
                      const Icon    = step.icon;

                      return (
                        <li key={step.key} className="flex gap-5 sm:gap-6 relative z-10">
                          {/* Icon circle */}
                          <div
                            className={`w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                              done
                                ? active
                                  ? "bg-[#c9a84c] border-[#c9a84c] text-[#0a0806] shadow-[0_0_16px_rgba(201,168,76,0.4)]"
                                  : "bg-[#c9a84c]/20 border-[#c9a84c]/60 text-[#c9a84c]"
                                : "bg-transparent border-[#c9a84c]/15 text-[#6b6258]"
                            }`}
                          >
                            <Icon size={15} />
                          </div>

                          {/* Text */}
                          <div className="pt-0.5">
                            <div
                              className={`font-serif text-[1rem] leading-snug ${
                                done ? "text-[#f0e8dc]" : "text-[#6b6258]"
                              }`}
                            >
                              {step.label}
                              {active && (
                                <span className="ml-2 text-[0.6rem] bg-[#c9a84c] text-[#0a0806] font-bold tracking-[0.1em] uppercase px-1.5 py-0.5 align-middle">
                                  Current
                                </span>
                              )}
                            </div>
                            <div
                              className={`text-sm mt-0.5 ${
                                done ? "text-[#8a7d6e]" : "text-[#6b6258]/60"
                              }`}
                            >
                              {step.description}
                            </div>
                            {active && (
                              <div className="text-xs text-[#c9a84c] mt-1">
                                Updated: {formatDateTime(order.createdAt)}
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            ) : (
              <div className="bg-[#110e0a] border border-[#c4405a]/20 p-7 flex items-start gap-4">
                <XCircle size={28} className="text-[#c4405a] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-serif text-[1.1rem] text-[#f0e8dc] mb-1">
                    Order Cancelled
                  </div>
                  <p className="text-[#8a7d6e] text-sm leading-relaxed">
                    This order was cancelled. If you believe this is an error or need assistance,
                    please{" "}
                    <a href="/contact" className="text-[#c9a84c] hover:underline">
                      contact our support team
                    </a>
                    .
                  </p>
                </div>
              </div>
            )}

            {/* ── Order Items ── */}
            <div className="bg-[#110e0a] border border-[#c9a84c]/12 p-7">
              <h2 className="font-serif text-[1.1rem] text-[#f0e8dc] mb-5">
                Items in This Order
              </h2>
              <ul className="space-y-5">
                {order.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-4 pb-5 border-b border-[#c9a84c]/08 last:border-0 last:pb-0"
                  >
                    <div className="relative w-[72px] h-[90px] flex-shrink-0 bg-[#1a1410] overflow-hidden">
                      <Image
                        src={item.image || "/images/anarkali.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="72px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-sm text-[#f0e8dc] leading-snug mb-1 line-clamp-2">
                        {item.name}
                      </div>
                      <div className="text-[0.68rem] text-[#6b6258] tracking-wide space-x-2">
                        <span>Size: {item.size}</span>
                        <span>·</span>
                        <span>{item.color}</span>
                        <span>·</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <div className="mt-2 font-serif text-[#c9a84c] font-semibold text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Order totals */}
              <div className="mt-6 border-t border-[#c9a84c]/12 pt-5 space-y-2">
                {[
                  { label: "Subtotal",  value: formatPrice(order.subtotal) },
                  { label: "Shipping",  value: order.shipping === 0 ? "Free" : formatPrice(order.shipping) },
                  { label: "Tax (5%)", value: formatPrice(order.tax) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm text-[#8a7d6e]">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                ))}
                <div className="flex justify-between text-[1rem] font-serif pt-2 border-t border-[#c9a84c]/12">
                  <span className="text-[#f0e8dc] font-medium">Total</span>
                  <span className="text-[#c9a84c] font-semibold">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* ── Shipping Address ── */}
            <div className="bg-[#110e0a] border border-[#c9a84c]/12 p-7">
              <h2 className="font-serif text-[1.1rem] text-[#f0e8dc] mb-5 flex items-center gap-2">
                <MapPin size={16} className="text-[#c9a84c]" />
                Delivery Address
              </h2>
              <div className="text-[#b8a898] text-sm leading-loose">
                <p className="font-semibold text-[#f0e8dc]">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  — {order.shippingAddress.pincode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3">
                  <a
                    href={`tel:${order.shippingAddress.phone}`}
                    className="flex items-center gap-1.5 text-[#8a7d6e] hover:text-[#c9a84c] transition-colors"
                  >
                    <Phone size={12} />
                    {order.shippingAddress.phone}
                  </a>
                  <a
                    href={`mailto:${order.shippingAddress.email}`}
                    className="flex items-center gap-1.5 text-[#8a7d6e] hover:text-[#c9a84c] transition-colors"
                  >
                    <Mail size={12} />
                    {order.shippingAddress.email}
                  </a>
                </div>
              </div>
            </div>

            {/* ── Help CTA ── */}
            <div className="bg-[#110e0a] border border-[#c9a84c]/12 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="font-serif text-[1rem] text-[#f0e8dc] mb-0.5">
                  Need help with this order?
                </div>
                <p className="text-[#8a7d6e] text-sm">
                  Our team responds within 24 hours on business days.
                </p>
              </div>
              <a
                href={`/contact?orderId=${order._id}`}
                className="flex-shrink-0 inline-flex items-center gap-2 bg-[#c9a84c] text-[#0a0806] px-6 py-3 text-[0.72rem] font-semibold tracking-[0.1em] uppercase hover:bg-[#e8c96a] transition-colors"
              >
                Contact Support <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── Info strip ── */}
      {!order && (
        <section className="bg-[#110e0a] border-t border-[#c9a84c]/12 py-14 px-6">
          <div className="max-w-[1320px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { emoji: "📦", title: "Real-Time Status", desc: "Track every stage from placement to delivery in one place." },
              { emoji: "🔐", title: "Secure Lookup",    desc: "We verify your email to keep your order details private." },
              { emoji: "💬", title: "24h Support",      desc: "Questions? Our team is always ready to help you out." },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="flex flex-col items-center gap-3">
                <span className="text-3xl">{emoji}</span>
                <h3 className="font-serif text-[1rem] text-[#f0e8dc]">{title}</h3>
                <p className="text-[#8a7d6e] text-sm leading-relaxed max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

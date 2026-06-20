"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const STEPS = ["Cart Review", "Shipping", "Payment"];

const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry",
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, tax, total, clearCart } = useCartStore();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "Maharashtra",
    pincode: "", country: "India",
  });

  const sub = subtotal();
  const ship = shipping();
  const taxAmt = tax();
  const totalAmt = total();

  const setField = (key: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const validateStep1 = () => {
    const { firstName, lastName, email, phone, address, city, state, pincode } = form;
    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !pincode) {
      toast.error("Please fill in all required fields");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ""))) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateStep1()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            image: i.image,
            price: i.price,
            size: i.size,
            color: i.color,
            quantity: i.quantity,
          })),
          shippingAddress: { ...form },
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      const { order, razorpay_order_id } = data.data;

      // If Razorpay order created, open payment modal
      if (razorpay_order_id && process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        openRazorpay(order._id, razorpay_order_id, totalAmt);
      } else {
        // Fallback: treat as COD
        clearCart();
        router.push(`/order-confirmation?orderId=${order._id}&status=cod`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openRazorpay = (orderId: string, rzpOrderId: string, amount: number) => {
    // @ts-expect-error — Razorpay loaded via CDN script
    const rzp = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: "INR",
      name: "Taania Kandpal",
      description: "Luxury Indian Ethnic Wear",
      order_id: rzpOrderId,
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        const verifyRes = await fetch("/api/orders/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...response, orderId }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          clearCart();
          router.push(`/order-confirmation?orderId=${orderId}&status=paid`);
        } else {
          toast.error("Payment verification failed. Contact support.");
        }
      },
      prefill: {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        contact: form.phone,
      },
      theme: { color: "#c9a84c" },
    });
    rzp.open();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0806] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="font-serif text-[1.5rem] text-[#f0e8dc] mb-3">Your cart is empty</div>
          <p className="text-[#8a7d6e] text-sm mb-8">Add some beautiful pieces to your cart first.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0a0806] px-8 py-3.5 text-[0.78rem] font-semibold tracking-[0.12em] uppercase hover:bg-[#e8c96a] transition-all"
          >
            Continue Shopping <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="min-h-screen bg-[#0a0806] pt-28 pb-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          {/* Steps */}
          <div className="flex items-center justify-center mb-12 gap-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-4 py-2 text-[0.72rem] tracking-[0.1em] uppercase transition-colors ${
                    i === step
                      ? "text-[#c9a84c] font-semibold"
                      : i < step
                      ? "text-[#8a6f30]"
                      : "text-[#6b6258]"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                      i < step
                        ? "bg-[#c9a84c] border-[#c9a84c] text-[#0a0806]"
                        : i === step
                        ? "border-[#c9a84c] text-[#c9a84c]"
                        : "border-[#c9a84c]/20 text-[#6b6258]"
                    }`}
                  >
                    {i < step ? <CheckCircle size={14} /> : i + 1}
                  </span>
                  {s}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-12 h-px bg-[#c9a84c]/20" />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1fr_380px] gap-10">
            {/* Left Panel */}
            <div>
              {step === 0 && (
                <div>
                  <h2 className="font-serif text-[1.4rem] text-[#f0e8dc] mb-6">Review Cart</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={`${item.productId}-${item.size}-${item.color}`}
                        className="flex gap-4 p-4 bg-[#110e0a] border border-[#c9a84c]/10"
                      >
                        <div className="w-16 h-20 bg-[#1a1410] flex-shrink-0 overflow-hidden relative">
                          {item.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-serif text-[0.95rem] text-[#f0e8dc]">{item.name}</div>
                          <div className="text-[0.7rem] text-[#6b6258] mt-0.5">
                            {item.size} · {item.color} · Qty {item.quantity}
                          </div>
                          <div className="font-serif text-[#c9a84c] font-semibold mt-1.5">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="mt-8 flex items-center gap-2 bg-[#c9a84c] text-[#0a0806] px-8 py-3.5 text-[0.78rem] font-semibold tracking-[0.12em] uppercase hover:bg-[#e8c96a] transition-all"
                  >
                    Proceed to Shipping <ArrowRight size={15} />
                  </button>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="font-serif text-[1.4rem] text-[#f0e8dc] mb-6">Shipping Details</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {([
                      ["firstName", "First Name *"],
                      ["lastName", "Last Name *"],
                      ["email", "Email Address *"],
                      ["phone", "Phone Number *"],
                    ] as [keyof FormData, string][]).map(([key, label]) => (
                      <div key={key}>
                        <label className="text-[0.65rem] uppercase tracking-[0.15em] text-[#6b6258] block mb-1.5">
                          {label}
                        </label>
                        <input
                          id={key}
                          type={key === "email" ? "email" : "text"}
                          value={form[key]}
                          onChange={(e) => setField(key, e.target.value)}
                          className="w-full bg-[#110e0a] border border-[#c9a84c]/15 text-[#f0e8dc] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/40 placeholder-[#6b6258]"
                          placeholder={label.replace(" *", "")}
                        />
                      </div>
                    ))}

                    <div className="sm:col-span-2">
                      <label className="text-[0.65rem] uppercase tracking-[0.15em] text-[#6b6258] block mb-1.5">
                        Street Address *
                      </label>
                      <input
                        id="address"
                        type="text"
                        value={form.address}
                        onChange={(e) => setField("address", e.target.value)}
                        className="w-full bg-[#110e0a] border border-[#c9a84c]/15 text-[#f0e8dc] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/40 placeholder-[#6b6258]"
                        placeholder="Street address, apartment, etc."
                      />
                    </div>

                    <div>
                      <label className="text-[0.65rem] uppercase tracking-[0.15em] text-[#6b6258] block mb-1.5">
                        City *
                      </label>
                      <input
                        id="city"
                        type="text"
                        value={form.city}
                        onChange={(e) => setField("city", e.target.value)}
                        className="w-full bg-[#110e0a] border border-[#c9a84c]/15 text-[#f0e8dc] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/40 placeholder-[#6b6258]"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label className="text-[0.65rem] uppercase tracking-[0.15em] text-[#6b6258] block mb-1.5">
                        State *
                      </label>
                      <select
                        id="state"
                        value={form.state}
                        onChange={(e) => setField("state", e.target.value)}
                        className="w-full bg-[#110e0a] border border-[#c9a84c]/15 text-[#f0e8dc] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/40"
                      >
                        {INDIA_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[0.65rem] uppercase tracking-[0.15em] text-[#6b6258] block mb-1.5">
                        Pincode *
                      </label>
                      <input
                        id="pincode"
                        type="text"
                        value={form.pincode}
                        onChange={(e) => setField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="w-full bg-[#110e0a] border border-[#c9a84c]/15 text-[#f0e8dc] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/40 placeholder-[#6b6258]"
                        placeholder="6-digit pincode"
                        maxLength={6}
                      />
                    </div>

                    <div>
                      <label className="text-[0.65rem] uppercase tracking-[0.15em] text-[#6b6258] block mb-1.5">
                        Country
                      </label>
                      <input
                        id="country"
                        type="text"
                        value={form.country}
                        readOnly
                        className="w-full bg-[#110e0a] border border-[#c9a84c]/15 text-[#8a7d6e] px-4 py-3 text-sm cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setStep(0)}
                      className="flex items-center gap-2 border border-[#c9a84c]/20 text-[#8a7d6e] px-6 py-3.5 text-[0.75rem] tracking-[0.1em] uppercase hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all"
                    >
                      <ArrowLeft size={14} /> Back
                    </button>
                    <button
                      onClick={() => {
                        if (validateStep1()) setStep(2);
                      }}
                      className="flex items-center gap-2 bg-[#c9a84c] text-[#0a0806] px-8 py-3.5 text-[0.78rem] font-semibold tracking-[0.12em] uppercase hover:bg-[#e8c96a] transition-all"
                    >
                      Review Order <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="font-serif text-[1.4rem] text-[#f0e8dc] mb-6">Confirm & Pay</h2>

                  {/* Address summary */}
                  <div className="bg-[#110e0a] border border-[#c9a84c]/10 p-5 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-[0.68rem] uppercase tracking-[0.18em] text-[#c9a84c]">Delivery To</span>
                      <button onClick={() => setStep(1)} className="text-[0.68rem] text-[#c9a84c] hover:underline">Edit</button>
                    </div>
                    <p className="text-sm text-[#f0e8dc]">
                      {form.firstName} {form.lastName}
                    </p>
                    <p className="text-xs text-[#8a7d6e] mt-1">
                      {form.address}, {form.city}, {form.state} — {form.pincode}
                    </p>
                    <p className="text-xs text-[#8a7d6e]">{form.email} · {form.phone}</p>
                  </div>

                  <div className="bg-[#110e0a] border border-[#c9a84c]/10 p-5 mb-8">
                    <div className="text-[0.68rem] uppercase tracking-[0.18em] text-[#c9a84c] mb-3">Payment</div>
                    <p className="text-sm text-[#8a7d6e]">
                      Secure payment via Razorpay — supports UPI, cards, net banking, wallets & COD.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 border border-[#c9a84c]/20 text-[#8a7d6e] px-6 py-3.5 text-[0.75rem] tracking-[0.1em] uppercase hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all"
                    >
                      <ArrowLeft size={14} /> Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#c9a84c] text-[#0a0806] py-4 text-[0.82rem] font-bold tracking-[0.12em] uppercase hover:bg-[#e8c96a] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Processing…
                        </>
                      ) : (
                        <>
                          Place Order · {formatPrice(totalAmt)}
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="bg-[#110e0a] border border-[#c9a84c]/10 h-fit p-6 sticky top-28">
              <h3 className="font-serif text-[1.1rem] text-[#f0e8dc] mb-5">Order Summary</h3>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm">
                    <span className="text-[#8a7d6e] flex-1 pr-3 truncate">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-[#f0e8dc] flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#c9a84c]/12 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm text-[#8a7d6e]">
                  <span>Subtotal</span><span>{formatPrice(sub)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#8a7d6e]">
                  <span>Shipping</span>
                  <span>{ship === 0 ? <span className="text-[#c9a84c]">Free</span> : formatPrice(ship)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#8a7d6e]">
                  <span>Tax (5%)</span><span>{formatPrice(taxAmt)}</span>
                </div>
                <div className="border-t border-[#c9a84c]/12 pt-3 flex justify-between">
                  <span className="font-serif text-[#f0e8dc] font-medium">Total</span>
                  <span className="font-serif text-[#c9a84c] text-xl font-semibold">{formatPrice(totalAmt)}</span>
                </div>
              </div>
              {ship > 0 && (
                <p className="text-[0.68rem] text-[#6b6258] mt-3">
                  Add {formatPrice(5000 - sub)} more for free shipping
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

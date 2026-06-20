"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

const QUERY_TYPES = [
  "Order Status & Tracking",
  "Returns & Exchanges",
  "Product Information",
  "Custom / Bridal Order",
  "Sizing & Fit Help",
  "Bulk / Wholesale Inquiry",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    queryType: "",
    orderId: "",
    message: "",
  });
  const [state, setState] = useState<FormState>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    // Simulate async submission (replace with real API call)
    await new Promise((r) => setTimeout(r, 1600));
    setState("success");
  };

  return (
    <>
      {/* ── PAGE HERO ── */}
      <section className="relative overflow-hidden bg-[#0d0a07] pt-36 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/4 to-transparent pointer-events-none" />
        {/* decorative lines */}
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-[#c9a84c]/10 to-transparent ml-24 hidden lg:block" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#c9a84c]/10 to-transparent mr-24 hidden lg:block" />

        <div className="relative max-w-[1320px] mx-auto text-center">
          <span className="section-label mb-5 justify-center">Get In Touch</span>
          <h1 className="font-serif text-[clamp(2.4rem,5vw,4rem)] font-medium text-[#f0e8dc] mt-4 leading-tight">
            We&apos;d Love to{" "}
            <em className="text-[#c9a84c] italic">Hear</em> from You
          </h1>
          <p className="text-[#8a7d6e] mt-4 max-w-xl mx-auto text-[1rem] leading-relaxed">
            Have a question about your order, need styling advice, or planning a
            bespoke bridal outfit? Our team is here for you.
          </p>
        </div>
      </section>

      {/* ── CONTACT STRIP ── */}
      <div className="bg-[#c9a84c] py-4 px-6">
        <div className="max-w-[1320px] mx-auto flex flex-wrap justify-center gap-x-12 gap-y-3">
          {[
            { icon: Phone, label: "Call / WhatsApp", value: "+91 6393408658", href: "tel:6393408658" },
            { icon: Mail,  label: "Email Us",        value: "azbafashion5@gmail.com", href: "mailto:azbafashion5@gmail.com" },
            { icon: Clock, label: "Response Time",   value: "Within 24 hours", href: null },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={15} className="text-[#0a0806]" />
              <div className="flex items-center gap-2">
                <span className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-[#0a0806]/70">
                  {label}:
                </span>
                {href ? (
                  <a
                    href={href}
                    className="text-[0.85rem] font-semibold text-[#0a0806] hover:underline"
                  >
                    {value}
                  </a>
                ) : (
                  <span className="text-[0.85rem] font-semibold text-[#0a0806]">{value}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <section className="bg-[#0a0806] py-20 px-6">
        <div className="max-w-[1320px] mx-auto grid lg:grid-cols-[1fr_1.6fr] gap-12 items-start">

          {/* ── LEFT: Info cards ── */}
          <div className="space-y-6">
            {/* Card: Contact details */}
            <div className="bg-[#110e0a] border border-[#c9a84c]/12 p-7">
              <h2 className="font-serif text-[1.15rem] text-[#f0e8dc] mb-5">
                Contact Details
              </h2>
              <ul className="space-y-5">
                <li className="flex gap-4">
                  <span className="w-9 h-9 border border-[#c9a84c]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone size={14} className="text-[#c9a84c]" />
                  </span>
                  <div>
                    <div className="text-[0.68rem] uppercase tracking-[0.18em] text-[#c9a84c] mb-1">
                      Phone / WhatsApp
                    </div>
                    <a
                      href="tel:6393408658"
                      className="text-[#b8a898] text-sm hover:text-[#c9a84c] transition-colors"
                    >
                      +91 6393408658
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="w-9 h-9 border border-[#c9a84c]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail size={14} className="text-[#c9a84c]" />
                  </span>
                  <div>
                    <div className="text-[0.68rem] uppercase tracking-[0.18em] text-[#c9a84c] mb-1">
                      Email
                    </div>
                    <a
                      href="mailto:azbafashion5@gmail.com"
                      className="text-[#b8a898] text-sm hover:text-[#c9a84c] transition-colors break-all"
                    >
                      azbafashion5@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="w-9 h-9 border border-[#c9a84c]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin size={14} className="text-[#c9a84c]" />
                  </span>
                  <div>
                    <div className="text-[0.68rem] uppercase tracking-[0.18em] text-[#c9a84c] mb-1">
                      Studio
                    </div>
                    <p className="text-[#b8a898] text-sm leading-relaxed">
                      Azba Fashion Atelier<br />
                      Lucknow, Uttar Pradesh<br />
                      India — 226 001
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="w-9 h-9 border border-[#c9a84c]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock size={14} className="text-[#c9a84c]" />
                  </span>
                  <div>
                    <div className="text-[0.68rem] uppercase tracking-[0.18em] text-[#c9a84c] mb-1">
                      Working Hours
                    </div>
                    <p className="text-[#b8a898] text-sm leading-relaxed">
                      Mon – Sat: 10 AM – 7 PM IST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Card: FAQ quick links */}
            <div className="bg-[#110e0a] border border-[#c9a84c]/12 p-7">
              <h2 className="font-serif text-[1.15rem] text-[#f0e8dc] mb-4">
                Quick Help
              </h2>
              <ul className="space-y-3">
                {[
                  "How do I track my order?",
                  "What is your return policy?",
                  "Do you ship internationally?",
                  "How do I request a custom size?",
                  "Can I visit the studio in person?",
                ].map((q) => (
                  <li key={q}>
                    <button className="text-left text-sm text-[#8a7d6e] hover:text-[#c9a84c] transition-colors flex items-start gap-2 w-full group">
                      <span className="text-[#c9a84c] mt-0.5 flex-shrink-0 text-xs">✦</span>
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                        {q}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div className="bg-[#110e0a] border border-[#c9a84c]/12 p-7">
              <h2 className="font-serif text-[1.15rem] text-[#f0e8dc] mb-4">
                Follow Us
              </h2>
              <div className="flex gap-3">
                {[
                  {
                    label: "Instagram",
                    href: "https://instagram.com",
                    icon: (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="20" rx="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                    ),
                  },
                  {
                    label: "YouTube",
                    href: "https://youtube.com",
                    icon: (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                      </svg>
                    ),
                  },
                ].map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 border border-[#c9a84c]/20 flex items-center justify-center text-[#8a7d6e] hover:bg-[#c9a84c] hover:border-[#c9a84c] hover:text-[#0a0806] transition-all"
                  >
                    {icon}
                  </a>
                ))}
              </div>
              <p className="text-[#6b6258] text-xs mt-3 leading-relaxed">
                DM us on Instagram for quick styling queries — we reply within a few hours!
              </p>
            </div>
          </div>

          {/* ── RIGHT: Query Form ── */}
          <div className="bg-[#110e0a] border border-[#c9a84c]/12 p-8 lg:p-10">
            {state === "success" ? (
              /* Success state */
              <div className="flex flex-col items-center justify-center py-16 text-center gap-5">
                <div className="w-20 h-20 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center">
                  <CheckCircle size={36} className="text-[#c9a84c]" />
                </div>
                <div>
                  <h3 className="font-serif text-[1.5rem] text-[#f0e8dc] mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-[#8a7d6e] text-sm leading-relaxed max-w-sm">
                    Thank you for reaching out. Our team will get back to you at{" "}
                    <span className="text-[#c9a84c]">{form.email}</span> within 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => { setForm({ name:"", email:"", phone:"", queryType:"", orderId:"", message:"" }); setState("idle"); }}
                  className="mt-2 text-[0.72rem] uppercase tracking-[0.12em] border border-[#c9a84c]/30 text-[#c9a84c] px-6 py-2.5 hover:bg-[#c9a84c] hover:text-[#0a0806] transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="font-serif text-[1.6rem] text-[#f0e8dc] mb-1">
                    Send Us a Message
                  </h2>
                  <p className="text-[#8a7d6e] text-sm">
                    Fill in the form below and we&apos;ll get back to you as soon as possible.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Name + Email */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-[0.68rem] uppercase tracking-[0.18em] text-[#c9a84c] mb-2"
                      >
                        Full Name <span className="text-[#c4405a]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Priya Sharma"
                        className="w-full bg-[#0a0806]/60 border border-[#c9a84c]/20 text-[#f0e8dc] placeholder-[#6b6258] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-[0.68rem] uppercase tracking-[0.18em] text-[#c9a84c] mb-2"
                      >
                        Email Address <span className="text-[#c4405a]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full bg-[#0a0806]/60 border border-[#c9a84c]/20 text-[#f0e8dc] placeholder-[#6b6258] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone + Query type */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-[0.68rem] uppercase tracking-[0.18em] text-[#c9a84c] mb-2"
                      >
                        Phone / WhatsApp
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#0a0806]/60 border border-[#c9a84c]/20 text-[#f0e8dc] placeholder-[#6b6258] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-query-type"
                        className="block text-[0.68rem] uppercase tracking-[0.18em] text-[#c9a84c] mb-2"
                      >
                        Query Type <span className="text-[#c4405a]">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="contact-query-type"
                          name="queryType"
                          required
                          value={form.queryType}
                          onChange={handleChange}
                          className="w-full appearance-none bg-[#0a0806]/60 border border-[#c9a84c]/20 text-[#f0e8dc] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors cursor-pointer"
                        >
                          <option value="" disabled className="text-[#6b6258]">
                            Select a topic…
                          </option>
                          {QUERY_TYPES.map((q) => (
                            <option key={q} value={q} className="bg-[#0d0a07]">
                              {q}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a7d6e] pointer-events-none"
                          width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Order ID (optional) */}
                  <div>
                    <label
                      htmlFor="contact-order-id"
                      className="block text-[0.68rem] uppercase tracking-[0.18em] text-[#c9a84c] mb-2"
                    >
                      Order ID{" "}
                      <span className="text-[#6b6258] normal-case tracking-normal lowercase font-normal">
                        (optional — if query is about an existing order)
                      </span>
                    </label>
                    <input
                      id="contact-order-id"
                      name="orderId"
                      type="text"
                      value={form.orderId}
                      onChange={handleChange}
                      placeholder="e.g. AZB-2026-001234"
                      className="w-full bg-[#0a0806]/60 border border-[#c9a84c]/20 text-[#f0e8dc] placeholder-[#6b6258] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-[0.68rem] uppercase tracking-[0.18em] text-[#c9a84c] mb-2"
                    >
                      Your Message <span className="text-[#c4405a]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Describe your query in detail so we can help you better…"
                      className="w-full bg-[#0a0806]/60 border border-[#c9a84c]/20 text-[#f0e8dc] placeholder-[#6b6258] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors resize-none"
                    />
                  </div>

                  {/* Error */}
                  {state === "error" && (
                    <div className="flex items-center gap-2 text-[#c4405a] text-sm bg-[#c4405a]/8 border border-[#c4405a]/20 px-4 py-3">
                      <AlertCircle size={15} />
                      Something went wrong. Please try again or email us directly.
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    id="contact-submit"
                    type="submit"
                    disabled={state === "loading"}
                    className="w-full flex items-center justify-center gap-2.5 bg-[#c9a84c] text-[#0a0806] py-4 text-[0.78rem] font-semibold tracking-[0.12em] uppercase hover:bg-[#e8c96a] transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-[0_8px_30px_rgba(201,168,76,0.35)] hover:-translate-y-0.5"
                  >
                    {state === "loading" ? (
                      <>
                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-[0.68rem] text-[#6b6258] text-center">
                    ✦ We respond within 24 hours on business days ✦ Your details are kept private
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── PROMISE STRIP ── */}
      <section className="bg-[#110e0a] border-t border-[#c9a84c]/12 py-14 px-6">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { emoji: "⚡", title: "Fast Response", desc: "We reply to every message within 24 business hours." },
              { emoji: "🔒", title: "Private & Secure", desc: "Your personal details are never shared with third parties." },
              { emoji: "💛", title: "Human Support", desc: "Real people, not bots — every query gets personal attention." },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="flex flex-col items-center gap-3">
                <span className="text-3xl">{emoji}</span>
                <h3 className="font-serif text-[1rem] text-[#f0e8dc]">{title}</h3>
                <p className="text-[#8a7d6e] text-sm leading-relaxed max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

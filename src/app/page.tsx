import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

export const metadata: Metadata = {
  title: "Taania Kandpal — Luxury Indian Ethnic Wear",
  description:
    "Handcrafted Indian ethnic wear — lehengas, anarkalis, sarees, and kurtas designed for the modern woman who celebrates her heritage.",
};

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/products?limit=6&featured=true`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.products ?? [];
  } catch {
    return [];
  }
}

const CATEGORIES = [
  {
    name: "Anarkali",
    slug: "anarkali",
    count: "48 Designs",
    image: "/images/anarkali.png",
    gradient: "from-[#2a1a08]/80 to-transparent",
  },
  {
    name: "Lehenga",
    slug: "lehenga",
    count: "32 Designs",
    image: "/images/lehenga.png",
    gradient: "from-[#1a0812]/80 to-transparent",
  },
  {
    name: "Sarees",
    slug: "saree",
    count: "60 Designs",
    image: "/images/saree.png",
    gradient: "from-[#081820]/80 to-transparent",
  },
  {
    name: "Kurtas",
    slug: "kurta",
    count: "55 Designs",
    image: "/images/kurta.png",
    gradient: "from-[#0a1a08]/80 to-transparent",
  },
];

const TESTIMONIALS = [
  {
    text: "I wore the Champagne Anarkali at my brother's wedding and received more compliments than I can count. The embroidery is absolutely divine.",
    name: "Priya Sharma",
    role: "Mumbai · Verified Buyer",
    initials: "P",
  },
  {
    text: "The bridal lehenga was beyond my expectations. They customised the blouse fit perfectly, and the zardozi work is truly couture-level.",
    name: "Ananya Mehta",
    role: "Delhi · Verified Bride",
    initials: "A",
  },
  {
    text: "Taania Kandpal is my go-to for every occasion. The packaging is a luxury experience in itself — arrives in a gold box with a handwritten note.",
    name: "Rhea Kapoor",
    role: "Bangalore · Loyal Customer",
    initials: "R",
  },
];

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative h-screen min-h-[680px] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 animate-hero-zoom">
          <Image
            src="/images/hero1.png"
            alt="Luxury Indian ethnic wear"
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
        </div>
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0806]/95 via-[#0a0806]/55 to-[#0a0806]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806]/80 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-[1320px] mx-auto px-6 w-full">
          <div className="max-w-[620px]">
            <div className="flex items-center gap-3 mb-6 animate-fade-up">
              <span className="h-px w-10 bg-[#c9a84c]/60" />
              <span className="text-[0.68rem] tracking-[0.28em] uppercase text-[#c9a84c]">
                New Bridal Collection 2026
              </span>
            </div>
            <h1 className="font-serif text-[clamp(2.8rem,6vw,5rem)] font-medium leading-[1.06] text-[#f0e8dc] mb-6 animate-fade-up delay-100">
              Where{" "}
              <em className="text-[#c9a84c] font-medium not-italic italic">
                Tradition
              </em>
              <br />
              Meets Timeless
              <br />
              Elegance
            </h1>
            <p className="text-[#b8a898] text-[1.05rem] leading-relaxed max-w-[440px] mb-8 animate-fade-up delay-200">
              Handcrafted Indian ethnic wear where centuries-old artistry meets
              contemporary design. Each piece tells a story of heritage,
              devotion, and uncompromising beauty.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up delay-300">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0a0806] px-8 py-3.5 text-[0.78rem] font-semibold tracking-[0.12em] uppercase hover:bg-[#e8c96a] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,168,76,0.35)]"
              >
                Explore Collection
                <ArrowRight size={15} />
              </Link>
              <Link
                href="#story"
                className="inline-flex items-center gap-2 border border-[#f0e8dc]/25 text-[#f0e8dc] px-8 py-3.5 text-[0.78rem] font-medium tracking-[0.12em] uppercase hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="text-[0.62rem] tracking-[0.2em] uppercase text-[#8a7d6e]">
            Scroll
          </span>
          <div className="w-px h-14 bg-gradient-to-b from-[#8a6f30] to-transparent animate-scroll-pulse" />
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="bg-[#c9a84c] py-3 overflow-hidden" aria-hidden="true">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex items-center">
              {[
                "Anarkali",
                "Lehenga Choli",
                "Banarasi Silk",
                "Bridal Couture",
                "Festive Wear",
                "Hand Embroidery",
                "Zardozi Work",
                "Kutch Embroidery",
              ].map((t) => (
                <span
                  key={t}
                  className="text-[#0a0806] text-[0.68rem] font-semibold tracking-[0.18em] uppercase px-8 flex items-center gap-8"
                >
                  ✦ {t}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <section className="bg-[#0d0a07] py-24 px-6">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-14">
            <span className="section-label mb-4">Collections</span>
            <h2 className="font-serif text-[clamp(1.9rem,4vw,3rem)] font-medium text-[#f0e8dc] mt-4">
              Curated for Every{" "}
              <em className="text-[#c9a84c] italic">Occasion</em>
            </h2>
            <p className="text-[#8a7d6e] mt-3 max-w-xl mx-auto text-sm">
              From intimate celebrations to grand festivities — find the
              ensemble that speaks to your soul.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className="group relative overflow-hidden aspect-[3/4] block"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806]/88 via-[#0a0806]/20 to-transparent group-hover:from-[#0a0806]/95 transition-all duration-400" />
                <div className="absolute inset-x-0 bottom-0 p-5 translate-y-0 group-hover:-translate-y-2 transition-transform duration-400">
                  <div className="font-serif text-[1.35rem] font-medium text-[#f0e8dc] leading-snug">
                    {cat.name}
                  </div>
                  <div className="text-[0.68rem] text-[#c9a84c] tracking-wide mt-0.5">
                    {cat.count}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-[0.7rem] tracking-[0.12em] uppercase text-[#c9a84c] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="bg-[#0a0806] py-24 px-6" id="featured">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-14">
            <span className="section-label mb-4">Featured</span>
            <h2 className="font-serif text-[clamp(1.9rem,4vw,3rem)] font-medium text-[#f0e8dc] mt-4">
              Bestselling <em className="text-[#c9a84c] italic">Pieces</em>
            </h2>
            <p className="text-[#8a7d6e] mt-3 text-sm">
              Hand-picked by our curators — the season&apos;s most coveted designs.
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[#8a7d6e] mb-6">
                No products yet.{" "}
                <a
                  href="/api/products/seed"
                  className="text-[#c9a84c] hover:underline"
                >
                  Seed demo data →
                </a>
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 border border-[#c9a84c]/30 text-[#c9a84c] px-8 py-3 text-[0.75rem] font-medium tracking-[0.12em] uppercase hover:bg-[#c9a84c] hover:text-[#0a0806] transition-all"
            >
              View All Products <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BRIDAL BANNER ── */}
      <section className="relative py-36 px-6 overflow-hidden">
        <Image
          src="/images/collection.png"
          alt="Bridal Collection 2026"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0a0806]/70" />
        <div className="relative z-10 max-w-[700px] mx-auto text-center">
          <span className="section-label mb-6 justify-center">
            Limited Edition
          </span>
          <h2 className="font-serif text-[clamp(2.2rem,5vw,4rem)] font-medium text-[#f0e8dc] leading-tight mb-5 mt-4">
            The 2026{" "}
            <em className="text-[#c9a84c] italic">Bridal</em> Collection
          </h2>
          <p className="text-[#b8a898] text-[1.05rem] mb-8 max-w-[500px] mx-auto leading-relaxed">
            An ode to the modern bride — bold, ethereal, and undeniably regal.
            Each piece crafted by master artisans with 20+ years of experience.
          </p>
          <Link
            href="/shop?bridal=true"
            className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0a0806] px-10 py-4 text-[0.8rem] font-semibold tracking-[0.12em] uppercase hover:bg-[#e8c96a] transition-all hover:shadow-[0_8px_30px_rgba(201,168,76,0.4)]"
          >
            Discover Bridal <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="bg-[#110e0a] py-24 px-6" id="story">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Images */}
            <div className="relative h-[500px] lg:h-[580px]">
              <div className="absolute top-0 left-0 w-[70%] h-[80%] overflow-hidden border border-[#c9a84c]/12">
                <Image
                  src="/images/hero2.png"
                  alt="Our craftsmanship"
                  fill
                  className="object-cover"
                  sizes="40vw"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-[52%] h-[55%] overflow-hidden border border-[#c9a84c]/12 outline outline-6 outline-[#110e0a]">
                <Image
                  src="/images/about.png"
                  alt="Taania Kandpal"
                  fill
                  className="object-cover"
                  sizes="30vw"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#c9a84c] flex items-center justify-center z-10">
                <span className="font-serif text-[1.4rem] text-[#0a0806] italic font-semibold">
                  TK
                </span>
              </div>
            </div>
            {/* Text */}
            <div>
              <span className="section-label mb-4">Our Story</span>
              <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-medium text-[#f0e8dc] leading-tight mt-4 mb-0">
                Born from a Love of{" "}
                <em className="text-[#c9a84c] italic">Heritage</em>
              </h2>
              <blockquote className="font-serif italic text-[1.25rem] text-[#f0e8dc] leading-snug border-l-2 border-[#c9a84c] pl-5 my-6">
                &ldquo;Every thread I weave is a conversation between the past
                and the present — a bridge between grandmothers and
                granddaughters.&rdquo;
              </blockquote>
              <p className="text-[#8a7d6e] text-sm leading-relaxed mb-4">
                Taania Kandpal began as a dream in a small atelier in Lucknow,
                where master craftsmen worked by lamplight, their needles
                dancing through silk like calligraphers on parchment.
              </p>
              <p className="text-[#8a7d6e] text-sm leading-relaxed">
                We collaborate exclusively with artisans trained in traditional
                crafts — zardozi, chikankari, kantha, and mirror work —
                ensuring each purchase directly supports a community of skilled
                makers.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-8 border-t border-[#c9a84c]/12 pt-7">
                {[
                  { num: "12+", label: "Years of Craft" },
                  { num: "200+", label: "Artisan Partners" },
                  { num: "50k+", label: "Happy Brides" },
                ].map((s) => (
                  <div key={s.label}>
                    <span className="font-serif text-[2.1rem] text-[#c9a84c] font-semibold block leading-none mb-1">
                      {s.num}
                    </span>
                    <span className="text-[0.7rem] tracking-[0.12em] uppercase text-[#8a7d6e]">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="bg-[#0d0a07] py-24 px-6">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-14">
            <span className="section-label mb-4">Craftsmanship</span>
            <h2 className="font-serif text-[clamp(1.9rem,4vw,3rem)] font-medium text-[#f0e8dc] mt-4">
              The Art of <em className="text-[#c9a84c] italic">Making</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#8a6f30]/50 to-transparent" />
            {[
              {
                num: "I",
                title: "Design Atelier",
                desc: "Our designers draw inspiration from Mughal miniatures, temple architecture, and contemporary runways to create original patterns.",
              },
              {
                num: "II",
                title: "Fabric Sourcing",
                desc: "We source only the finest silks and georgettes — directly from Varanasi, Kanchipuram, and Surat weavers.",
              },
              {
                num: "III",
                title: "Hand Embroidery",
                desc: "Skilled artisans hand-embroider each piece using zardozi, sequins, and resham threads. A single piece can take 200+ hours.",
              },
              {
                num: "IV",
                title: "Quality & Finishing",
                desc: "Every garment undergoes rigorous quality checks before being hand-pressed, packed in our gilded box, and shipped.",
              },
            ].map((s) => (
              <div key={s.num} className="text-center relative z-10">
                <div className="w-20 h-20 border border-[#c9a84c]/20 rounded-full flex items-center justify-center mx-auto mb-5 bg-[#0d0a07]">
                  <span className="font-serif text-[1.4rem] text-[#c9a84c]">
                    {s.num}
                  </span>
                </div>
                <h3 className="font-serif text-[1rem] text-[#f0e8dc] mb-2">
                  {s.title}
                </h3>
                <p className="text-[#8a7d6e] text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-[#0a0806] py-24 px-6">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-14">
            <span className="section-label mb-4">Testimonials</span>
            <h2 className="font-serif text-[clamp(1.9rem,4vw,3rem)] font-medium text-[#f0e8dc] mt-4">
              Words from Our <em className="text-[#c9a84c] italic">Brides</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-[#110e0a] border border-[#c9a84c]/10 p-7 relative"
              >
                <div
                  className="absolute top-2 left-5 font-serif text-[5rem] text-[#c9a84c]/15 leading-none select-none"
                  aria-hidden="true"
                >
                  &ldquo;
                </div>
                <div className="flex mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className="text-[#c9a84c] fill-[#c9a84c]" />
                  ))}
                </div>
                <p className="text-[#b8a898] text-sm leading-relaxed italic mb-5 relative">
                  {t.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8a6f30] to-[#6b1a2e] flex items-center justify-center font-serif text-[1rem] text-[#f0e8dc] flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#f0e8dc]">{t.name}</div>
                    <div className="text-xs text-[#6b6258]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="bg-[#110e0a] border-t border-[#c9a84c]/12 py-20 px-6">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-serif text-[clamp(1.7rem,3vw,2.4rem)] font-medium text-[#f0e8dc] mb-2">
                Join the Taania Circle
              </h2>
              <p className="text-[#8a7d6e] text-sm leading-relaxed">
                Be the first to know about new collections, exclusive offers, and
                behind-the-scenes stories from our atelier. No spam — ever.
              </p>
            </div>
            <div>
              <form className="flex" aria-label="Newsletter subscription">
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Your email address"
                  aria-label="Email address"
                  required
                  className="flex-1 bg-[#0a0806]/80 border border-[#c9a84c]/20 border-r-0 text-[#f0e8dc] px-4 py-3 text-sm placeholder-[#6b6258] focus:outline-none focus:border-[#c9a84c]/50"
                />
                <button
                  type="button"
                  className="bg-[#c9a84c] text-[#0a0806] px-6 py-3 text-[0.72rem] font-semibold tracking-[0.12em] uppercase hover:bg-[#e8c96a] transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-[0.68rem] text-[#6b6258] mt-2">
                ✦ Unsubscribe anytime · ✦ No spam guaranteed
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

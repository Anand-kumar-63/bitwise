import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import ProductDetailClient from "./ProductDetailClient";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product)
    return { title: "Product Not Found | Taania Kandpal" };
  return {
    title: `${product.name} | Taania Kandpal`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-[#0a0806] pt-24 pb-20">
      <div className="max-w-[1320px] mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[0.72rem] tracking-[0.1em] text-[#6b6258] mb-8 uppercase">
          <a href="/" className="hover:text-[#c9a84c] transition-colors">Home</a>
          <span>/</span>
          <a href="/shop" className="hover:text-[#c9a84c] transition-colors">Shop</a>
          <span>/</span>
          <span className="text-[#c9a84c]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-14">
          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#110e0a]">
              <Image
                src={product.images[0] ?? "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {product.isBridal && (
                <div className="absolute top-4 left-4 bg-[#6b1a2e] text-[#f5ede0] text-[0.62rem] font-bold tracking-[0.15em] uppercase px-2.5 py-1">
                  Bridal
                </div>
              )}
              {product.isNew && (
                <div className="absolute top-4 left-4 mt-7 bg-[#c9a84c] text-[#0a0806] text-[0.62rem] font-bold tracking-[0.15em] uppercase px-2.5 py-1">
                  New
                </div>
              )}
            </div>
            {/* Thumbnail row */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.slice(0, 5).map((img, i) => (
                  <div key={i} className="relative w-20 aspect-[3/4] overflow-hidden bg-[#110e0a] border border-[#c9a84c]/20">
                    <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:pt-4">
            <div className="text-[0.68rem] tracking-[0.2em] uppercase text-[#c9a84c] mb-2">
              {product.category}
            </div>
            <h1 className="font-serif text-[clamp(1.6rem,3vw,2.4rem)] font-medium text-[#f0e8dc] leading-snug mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[#c9a84c] text-sm">
                {"★".repeat(Math.round(product.rating))}
                {"☆".repeat(5 - Math.round(product.rating))}
              </span>
              <span className="text-[#6b6258] text-xs">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-6">
              <span className="font-serif text-[2rem] text-[#c9a84c] font-semibold leading-none">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-[#6b6258] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-[0.72rem] bg-[#c4405a]/15 text-[#c4405a] px-2 py-0.5 font-semibold">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-[#8a7d6e] text-sm leading-relaxed mb-7 border-b border-[#c9a84c]/12 pb-7">
              {product.description}
            </p>

            {/* Details row */}
            <div className="grid grid-cols-2 gap-3 mb-7 text-sm">
              <div>
                <span className="text-[0.65rem] uppercase tracking-[0.15em] text-[#6b6258] block mb-0.5">Fabric</span>
                <span className="text-[#f0e8dc]">{product.fabric || "Premium Quality"}</span>
              </div>
              <div>
                <span className="text-[0.65rem] uppercase tracking-[0.15em] text-[#6b6258] block mb-0.5">Occasion</span>
                <span className="text-[#f0e8dc]">{product.occasion?.join(", ") || "All Occasions"}</span>
              </div>
              <div>
                <span className="text-[0.65rem] uppercase tracking-[0.15em] text-[#6b6258] block mb-0.5">Stock</span>
                <span className={product.stock > 5 ? "text-green-400" : "text-[#c4405a]"}>
                  {product.stock > 5 ? `In Stock (${product.stock})` : product.stock > 0 ? `Only ${product.stock} left!` : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Interactive selector (Client Component) */}
            <ProductDetailClient product={product} />

            {/* Assurances */}
            <div className="mt-7 grid grid-cols-3 gap-3 border-t border-[#c9a84c]/12 pt-6">
              {[
                { icon: "🚚", label: "Free Shipping", sub: "Over ₹5,000" },
                { icon: "↩️", label: "Easy Returns", sub: "Within 7 days" },
                { icon: "🔒", label: "Secure Payment", sub: "100% encrypted" },
              ].map((a) => (
                <div key={a.label} className="text-center">
                  <div className="text-xl mb-1">{a.icon}</div>
                  <div className="text-[0.7rem] font-semibold text-[#f0e8dc] tracking-wide">{a.label}</div>
                  <div className="text-[0.62rem] text-[#6b6258] mt-0.5">{a.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

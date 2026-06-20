"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();

  const discount =
    product.originalPrice
      ? calculateDiscount(product.originalPrice, product.price)
      : 0;

  const handleQuickAdd = () => {
    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? "",
      price: product.price,
      size: product.sizes[0] ?? "Free Size",
      color: product.colors[0]?.name ?? "Default",
      quantity: 1,
    });
    toast.success(`${product.name} added to cart!`, {
      style: {
        background: "#1a1410",
        color: "#f0e8dc",
        border: "1px solid rgba(201,168,76,0.3)",
        borderRadius: "0",
      },
      iconTheme: { primary: "#c9a84c", secondary: "#0a0806" },
    });
    openCart();
  };

  return (
    <article className="group bg-[#110e0a] border border-[#c9a84c]/10 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(201,168,76,0.2)]">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4]">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.images[0] ?? "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-[#c9a84c] text-[#0a0806] text-[0.6rem] font-bold tracking-[0.12em] uppercase px-2 py-1">
              New
            </span>
          )}
          {product.isBridal && (
            <span className="bg-[#6b1a2e] text-[#f5ede0] text-[0.6rem] font-bold tracking-[0.12em] uppercase px-2 py-1">
              Bridal
            </span>
          )}
          {discount > 0 && (
            <span className="bg-[#c4405a] text-white text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2 py-1">
              {discount}% off
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button
            aria-label="Add to wishlist"
            className="w-9 h-9 bg-[#0a0806]/80 backdrop-blur-sm border border-[#c9a84c]/20 flex items-center justify-center text-[#b8a898] hover:bg-[#c9a84c] hover:border-[#c9a84c] hover:text-[#0a0806] transition-all"
            onClick={() => toast("Added to wishlist ♡", { icon: "♡" })}
          >
            <Heart size={14} />
          </button>
          <Link
            href={`/products/${product.slug}`}
            aria-label="Quick view"
            className="w-9 h-9 bg-[#0a0806]/80 backdrop-blur-sm border border-[#c9a84c]/20 flex items-center justify-center text-[#b8a898] hover:bg-[#c9a84c] hover:border-[#c9a84c] hover:text-[#0a0806] transition-all"
          >
            <Eye size={14} />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="text-[0.62rem] tracking-[0.18em] uppercase text-[#c9a84c] mb-1.5">
          {product.category}
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="font-serif text-[1.05rem] font-medium text-[#f0e8dc] leading-snug mb-3 hover:text-[#c9a84c] transition-colors line-clamp-2"
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#c9a84c] text-xs tracking-wide">
            {"★".repeat(Math.round(product.rating))}
            {"☆".repeat(5 - Math.round(product.rating))}
          </span>
          <span className="text-[#6b6258] text-xs">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap mt-auto">
          <span className="font-serif text-lg text-[#c9a84c] font-semibold">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-[#6b6258] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleQuickAdd}
          className="mt-4 w-full flex items-center justify-center gap-2 border border-[#c9a84c]/20 text-[#b8a898] py-2.5 text-[0.72rem] font-medium tracking-[0.12em] uppercase transition-all hover:bg-[#c9a84c] hover:border-[#c9a84c] hover:text-[#0a0806]"
        >
          <ShoppingBag size={14} />
          Add to Cart
        </button>
      </div>
    </article>
  );
}

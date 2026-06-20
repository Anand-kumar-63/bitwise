"use client";

import { useState } from "react";
import { ShoppingBag, Heart } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

export default function ProductDetailClient({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.name ?? ""
  );
  const [qty, setQty] = useState(1);

  const { addItem, openCart } = useCartStore();

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? "",
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity: qty,
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
    <div className="space-y-6">
      {/* Color Selector */}
      {product.colors.length > 0 && (
        <div>
          <div className="text-[0.65rem] uppercase tracking-[0.18em] text-[#6b6258] mb-2.5">
            Colour:{" "}
            <span className="text-[#f0e8dc] font-medium">{selectedColor}</span>
          </div>
          <div className="flex gap-2.5">
            {product.colors.map((c) => (
              <button
                key={c.name}
                title={c.name}
                onClick={() => setSelectedColor(c.name)}
                style={{ backgroundColor: c.hex }}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === c.name
                    ? "border-[#c9a84c] scale-110 shadow-[0_0_0_2px_rgba(201,168,76,0.3)]"
                    : "border-transparent hover:border-[#c9a84c]/50"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {product.sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[0.65rem] uppercase tracking-[0.18em] text-[#6b6258]">
              Size:{" "}
              <span className="text-[#f0e8dc] font-medium">{selectedSize}</span>
            </span>
            <button className="text-[0.62rem] text-[#c9a84c] hover:underline tracking-wide">
              Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`min-w-[42px] px-3 py-2 text-[0.72rem] font-medium tracking-wide border transition-all ${
                  selectedSize === s
                    ? "bg-[#c9a84c] border-[#c9a84c] text-[#0a0806]"
                    : "border-[#c9a84c]/20 text-[#b8a898] hover:border-[#c9a84c] hover:text-[#c9a84c]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Qty */}
      <div>
        <div className="text-[0.65rem] uppercase tracking-[0.18em] text-[#6b6258] mb-2.5">
          Quantity
        </div>
        <div className="flex items-center border border-[#c9a84c]/20 w-fit">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-[#8a7d6e] hover:text-[#c9a84c] transition-colors text-lg"
          >
            −
          </button>
          <span className="w-12 text-center text-sm text-[#f0e8dc]">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="w-10 h-10 flex items-center justify-center text-[#8a7d6e] hover:text-[#c9a84c] transition-colors text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-1 flex items-center justify-center gap-2 bg-[#c9a84c] text-[#0a0806] py-4 font-semibold text-[0.8rem] tracking-[0.12em] uppercase hover:bg-[#e8c96a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag size={16} />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
        <button
          title="Add to Wishlist"
          className="w-14 flex items-center justify-center border border-[#c9a84c]/20 text-[#8a7d6e] hover:bg-[#c9a84c] hover:border-[#c9a84c] hover:text-[#0a0806] transition-all"
          onClick={() => toast("Added to wishlist ♡", { icon: "♡" })}
        >
          <Heart size={17} />
        </button>
      </div>
    </div>
  );
}

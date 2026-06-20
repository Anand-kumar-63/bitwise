"use client";

import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    shipping,
    tax,
    total,
  } = useCartStore();

  const sub = subtotal();
  const ship = shipping();
  const totalAmt = total();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[420px] bg-[#0d0a07] border-l border-[#c9a84c]/15 flex flex-col transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#c9a84c]/12">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#c9a84c]" />
            <h2 className="font-serif text-[1.1rem] text-[#f0e8dc]">Your Cart</h2>
            {items.length > 0 && (
              <span className="text-[0.65rem] bg-[#c9a84c] text-[#0a0806] px-1.5 py-0.5 font-bold rounded-sm">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="w-8 h-8 flex items-center justify-center text-[#8a7d6e] hover:text-[#c9a84c] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
              <div className="w-20 h-20 border border-[#c9a84c]/20 flex items-center justify-center">
                <ShoppingBag size={32} className="text-[#c9a84c]/40" />
              </div>
              <div>
                <p className="font-serif text-[1.1rem] text-[#f0e8dc] mb-2">Your cart is empty</p>
                <p className="text-[#6b6258] text-sm">
                  Discover our exquisite collections and find something you&apos;ll love.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="mt-2 text-[0.72rem] font-medium tracking-[0.12em] uppercase text-[#c9a84c] border border-[#c9a84c]/30 px-6 py-2.5 hover:bg-[#c9a84c] hover:text-[#0a0806] transition-all"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex gap-4 pb-5 border-b border-[#c9a84c]/08"
                >
                  {/* Image */}
                  <div className="relative w-[88px] h-[110px] flex-shrink-0 bg-[#1a1410]">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="88px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="font-serif text-sm text-[#f0e8dc] hover:text-[#c9a84c] transition-colors line-clamp-2 leading-snug"
                    >
                      {item.name}
                    </Link>
                    <div className="flex gap-3 mt-1.5 text-[0.68rem] text-[#6b6258] tracking-wide">
                      <span>Size: {item.size}</span>
                      <span>·</span>
                      <span>{item.color}</span>
                    </div>
                    <div className="mt-2.5 font-serif text-[#c9a84c] font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </div>

                    {/* Qty + Remove */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#c9a84c]/20">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.color,
                              item.quantity - 1
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center text-[#8a7d6e] hover:text-[#c9a84c] transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm text-[#f0e8dc]">
                          {item.quantity}
                        </span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.color,
                              item.quantity + 1
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center text-[#8a7d6e] hover:text-[#c9a84c] transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        aria-label="Remove item"
                        onClick={() =>
                          removeItem(item.productId, item.size, item.color)
                        }
                        className="text-[#6b6258] hover:text-[#c4405a] transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="border-t border-[#c9a84c]/12 px-6 py-5 space-y-3">
            <div className="flex justify-between text-sm text-[#8a7d6e]">
              <span>Subtotal</span>
              <span>{formatPrice(sub)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#8a7d6e]">
              <span>Shipping</span>
              <span>{ship === 0 ? <span className="text-[#c9a84c]">Free</span> : formatPrice(ship)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#8a7d6e]">
              <span>Tax (5%)</span>
              <span>{formatPrice(tax())}</span>
            </div>
            {ship > 0 && (
              <p className="text-[0.7rem] text-[#6b6258]">
                Add {formatPrice(5000 - sub)} more for free shipping
              </p>
            )}
            <div className="border-t border-[#c9a84c]/12 pt-3 flex justify-between">
              <span className="font-serif text-[#f0e8dc] font-medium">Total</span>
              <span className="font-serif text-[#c9a84c] text-lg font-semibold">
                {formatPrice(totalAmt)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full bg-[#c9a84c] text-[#0a0806] py-3.5 font-semibold text-[0.78rem] tracking-[0.12em] uppercase hover:bg-[#e8c96a] transition-colors mt-2"
            >
              Proceed to Checkout
              <ArrowRight size={15} />
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-center text-[0.7rem] tracking-[0.1em] uppercase text-[#8a7d6e] hover:text-[#c9a84c] transition-colors py-1"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

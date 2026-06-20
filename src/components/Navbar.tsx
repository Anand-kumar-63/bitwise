"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, Heart, Search, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, toggleCart } = useCartStore();
  const count = itemCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/shop", label: "Collections" },
    { href: "/shop?category=lehenga", label: "Lehenga" },
    { href: "/shop?category=anarkali", label: "Anarkali" },
    { href: "/shop?category=saree", label: "Sarees" },
    { href: "/shop?category=kurta", label: "Kurtas" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0806]/95 backdrop-blur-xl border-b border-[#c9a84c]/15 py-3"
            : "bg-[#0a0806]/60 backdrop-blur-md border-b border-white/5 py-5"
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-6 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-tight group">
            <span className="font-serif text-[1.35rem] font-semibold text-[#c9a84c] tracking-wide group-hover:text-[#e8c96a] transition-colors">
              Taania Kandpal
            </span>
            <span className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8a7d6e]">
              Luxury Indian Couture
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-8 list-none m-0">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[0.75rem] font-medium tracking-[0.12em] uppercase text-[#b8a898] hover:text-[#c9a84c] transition-colors relative group"
                >
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#c9a84c] group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Search"
              className="hidden sm:flex w-9 h-9 items-center justify-center text-[#8a7d6e] hover:text-[#c9a84c] transition-colors"
            >
              <Search size={18} />
            </button>
            <button
              aria-label="Wishlist"
              className="hidden sm:flex w-9 h-9 items-center justify-center text-[#8a7d6e] hover:text-[#c9a84c] transition-colors"
            >
              <Heart size={18} />
            </button>

            {/* Cart */}
            <button
              id="cart-button"
              aria-label={`Cart (${count} items)`}
              onClick={toggleCart}
              className="relative w-9 h-9 flex items-center justify-center text-[#8a7d6e] hover:text-[#c9a84c] transition-colors"
            >
              <ShoppingBag size={19} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center bg-[#c9a84c] text-[#0a0806] text-[0.6rem] font-bold rounded-full leading-none px-1">
                  {count}
                </span>
              )}
            </button>

            <Link
              href="/checkout"
              className="hidden md:inline-flex items-center gap-2 bg-[#c9a84c] text-[#0a0806] px-5 py-2.5 text-[0.72rem] font-semibold tracking-[0.1em] uppercase hover:bg-[#e8c96a] transition-colors"
            >
              Shop Now
            </Link>

            {/* Hamburger */}
            <button
              aria-label="Menu"
              className="lg:hidden w-9 h-9 flex items-center justify-center text-[#b8a898] hover:text-[#c9a84c]"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0a0806]/98 backdrop-blur-xl border-b border-[#c9a84c]/15 py-6 px-6 flex flex-col gap-4">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-[0.82rem] font-medium tracking-[0.12em] uppercase text-[#b8a898] hover:text-[#c9a84c] transition-colors py-1"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/checkout"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center bg-[#c9a84c] text-[#0a0806] px-5 py-3 text-[0.75rem] font-semibold tracking-[0.1em] uppercase hover:bg-[#e8c96a] transition-colors"
            >
              Shop Now
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}

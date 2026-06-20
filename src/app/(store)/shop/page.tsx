"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, X, ChevronDown, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

interface FilterState {
  category: string;
  priceMin: number;
  priceMax: number;
  bridal: boolean;
  sale: boolean;
  sort: string;
}

const CATEGORIES = [
  { value: "", label: "All Collections" },
  { value: "anarkali", label: "Anarkali" },
  { value: "lehenga", label: "Lehenga" },
  { value: "saree", label: "Sarees" },
  { value: "kurta", label: "Kurtas" },
];

const SORTS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get("category") ?? "",
    priceMin: 0,
    priceMax: 100000,
    bridal: searchParams.get("bridal") === "true",
    sale: searchParams.get("sale") === "true",
    sort: "newest",
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.bridal) params.set("bridal", "true");
    if (filters.sale) params.set("sale", "true");
    params.set("limit", "12");

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.success) {
        let prods: Product[] = (data.data?.products ?? data.data ?? []) as Product[];
        // Client-side price filter
        prods = prods.filter(
          (p) => p.price >= filters.priceMin && p.price <= filters.priceMax
        );
        // Client-side sort
        prods.sort((a, b) => {
          if (filters.sort === "price-asc") return a.price - b.price;
          if (filters.sort === "price-desc") return b.price - a.price;
          if (filters.sort === "rating") return b.rating - a.rating;
          return 0; // newest (default from API)
        });
        setProducts(prods);
        setTotal(data.data?.total ?? prods.length);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.bridal) params.set("bridal", "true");
    if (filters.sale) params.set("sale", "true");
    router.replace(`/shop?${params}`, { scroll: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.bridal, filters.sale]);

  const activeFilters = [
    filters.category && CATEGORIES.find((c) => c.value === filters.category)?.label,
    filters.bridal && "Bridal",
    filters.sale && "On Sale",
  ].filter((f): f is string => Boolean(f));

  return (
    <div className="min-h-screen bg-[#0a0806]">
      {/* Header */}
      <div className="relative overflow-hidden bg-[#0d0a07] py-24 px-6 border-b border-[#c9a84c]/12">
        <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/5 to-transparent" />
        <div className="relative max-w-[1320px] mx-auto text-center">
          <span className="section-label mb-4 justify-center">Collections</span>
          <h1 className="font-serif text-[clamp(2.2rem,5vw,4rem)] font-medium text-[#f0e8dc] mt-4 leading-tight">
            {filters.category
              ? CATEGORIES.find((c) => c.value === filters.category)?.label
              : filters.bridal
              ? "Bridal Collection"
              : "All Collections"}
          </h1>
          <p className="text-[#8a7d6e] mt-3 text-sm">
            {total > 0 ? `${total} designs` : "Explore our handcrafted ethnic wear"}
          </p>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6 py-10">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setFilters((f) => ({ ...f, category: c.value }))}
                className={`text-[0.72rem] tracking-[0.1em] uppercase px-4 py-2 transition-all ${
                  filters.category === c.value
                    ? "bg-[#c9a84c] text-[#0a0806] font-semibold"
                    : "border border-[#c9a84c]/20 text-[#8a7d6e] hover:border-[#c9a84c] hover:text-[#c9a84c]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Special filters */}
            <button
              onClick={() => setFilters((f) => ({ ...f, bridal: !f.bridal }))}
              className={`text-[0.72rem] tracking-[0.1em] uppercase px-3 py-2 transition-all ${
                filters.bridal
                  ? "bg-[#6b1a2e] text-[#f0e8dc] border border-[#6b1a2e]"
                  : "border border-[#c9a84c]/20 text-[#8a7d6e] hover:border-[#c9a84c]"
              }`}
            >
              Bridal
            </button>
            <button
              onClick={() => setFilters((f) => ({ ...f, sale: !f.sale }))}
              className={`text-[0.72rem] tracking-[0.1em] uppercase px-3 py-2 transition-all ${
                filters.sale
                  ? "bg-[#c4405a] text-white border border-[#c4405a]"
                  : "border border-[#c9a84c]/20 text-[#8a7d6e] hover:border-[#c4405a]"
              }`}
            >
              Sale
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, sort: e.target.value }))
                }
                className="appearance-none bg-[#110e0a] border border-[#c9a84c]/20 text-[#b8a898] text-[0.72rem] tracking-[0.08em] px-4 py-2 pr-8 focus:outline-none focus:border-[#c9a84c]/50 cursor-pointer"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a7d6e] pointer-events-none"
              />
            </div>

            {/* Price filter toggle */}
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="flex items-center gap-2 border border-[#c9a84c]/20 text-[#8a7d6e] px-3 py-2 text-[0.72rem] tracking-[0.08em] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all"
            >
              <SlidersHorizontal size={13} />
              Price
            </button>
          </div>
        </div>

        {/* Price Range */}
        {filtersOpen && (
          <div className="mb-8 p-5 bg-[#110e0a] border border-[#c9a84c]/12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[0.72rem] tracking-[0.18em] uppercase text-[#c9a84c]">
                Price Range
              </span>
              <button
                onClick={() => setFiltersOpen(false)}
                className="text-[#6b6258] hover:text-[#c9a84c]"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-[0.68rem] text-[#6b6258] uppercase tracking-wide block mb-1.5">
                  Min: {formatPrice(filters.priceMin)}
                </label>
                <input
                  type="range"
                  min={0}
                  max={100000}
                  step={500}
                  value={filters.priceMin}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      priceMin: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-[#c9a84c]"
                />
              </div>
              <div className="flex-1">
                <label className="text-[0.68rem] text-[#6b6258] uppercase tracking-wide block mb-1.5">
                  Max: {formatPrice(filters.priceMax)}
                </label>
                <input
                  type="range"
                  min={0}
                  max={100000}
                  step={500}
                  value={filters.priceMax}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      priceMax: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-[#c9a84c]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-[0.68rem] uppercase tracking-wide text-[#6b6258] self-center">
              Active:
            </span>
            {activeFilters.map((f) => (
              <span
                key={f}
                className="text-[0.68rem] bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] px-2.5 py-1 flex items-center gap-1.5"
              >
                {f}
              </span>
            ))}
            <button
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  category: "",
                  bridal: false,
                  sale: false,
                }))
              }
              className="text-[0.68rem] text-[#8a7d6e] hover:text-[#c4405a] transition-colors underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] skeleton rounded-none" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-serif text-[1.3rem] text-[#f0e8dc] mb-3">
              No products found
            </p>
            <p className="text-[#8a7d6e] text-sm mb-6">
              Try adjusting your filters or{" "}
              <button
                onClick={() =>
                  setFilters({
                    category: "",
                    priceMin: 0,
                    priceMax: 100000,
                    bridal: false,
                    sale: false,
                    sort: "newest",
                  })
                }
                className="text-[#c9a84c] hover:underline"
              >
                clear all
              </button>
            </p>
            <Link
              href="/api/products/seed"
              className="inline-flex items-center gap-2 border border-[#c9a84c]/30 text-[#c9a84c] px-6 py-3 text-[0.75rem] uppercase tracking-[0.12em] hover:bg-[#c9a84c] hover:text-[#0a0806] transition-all"
            >
              Seed Demo Products <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0806] flex items-center justify-center text-[#c9a84c]">Loading…</div>}>
      <ShopContent />
    </Suspense>
  );
}

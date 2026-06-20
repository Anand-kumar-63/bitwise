"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, ProductInput } from "@/types";
import { slugify } from "@/lib/utils";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const CATEGORIES = [
  { value: "anarkali", label: "Anarkali" },
  { value: "lehenga", label: "Lehenga" },
  { value: "saree", label: "Sarees" },
  { value: "kurta", label: "Kurtas" },
];

const inputClass =
  "w-full bg-[#0a0806] border border-[#c9a84c]/20 text-[#f0e8dc] px-4 py-2.5 text-sm focus:outline-none focus:border-[#c9a84c]/50";
const labelClass =
  "text-[0.65rem] uppercase tracking-[0.15em] text-[#6b6258] block mb-1.5";

interface ProductFormProps {
  initial?: Product;
  onSuccess: () => void;
}

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function ProductForm({ initial, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [category, setCategory] = useState<Product["category"]>(
    initial?.category ?? "anarkali"
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [originalPrice, setOriginalPrice] = useState(
    initial?.originalPrice ? String(initial.originalPrice) : ""
  );
  const [images, setImages] = useState(
    initial?.images.join(", ") ?? "/images/anarkali.png"
  );
  const [sizes, setSizes] = useState(
    initial?.sizes.join(", ") ?? "S, M, L, XL"
  );
  const [colors, setColors] = useState(
    initial?.colors.map((c) => `${c.name}|${c.hex}`).join(", ") ??
      "Gold|#c9a84c"
  );
  const [fabric, setFabric] = useState(initial?.fabric ?? "");
  const [occasion, setOccasion] = useState(initial?.occasion.join(", ") ?? "");
  const [tags, setTags] = useState(initial?.tags.join(", ") ?? "");
  const [rating, setRating] = useState(String(initial?.rating ?? 4.5));
  const [reviewCount, setReviewCount] = useState(
    String(initial?.reviewCount ?? 0)
  );
  const [stock, setStock] = useState(String(initial?.stock ?? 10));
  const [isBestseller, setIsBestseller] = useState(
    initial?.isBestseller ?? false
  );
  const [isNew, setIsNew] = useState(initial?.isNew ?? false);
  const [isBridal, setIsBridal] = useState(initial?.isBridal ?? false);

  const buildPayload = (): ProductInput => ({
    name,
    slug: slug || slugify(name),
    category,
    description,
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    images: parseList(images),
    sizes: parseList(sizes),
    colors: parseList(colors).map((entry) => {
      const [colorName, hex] = entry.split("|");
      return { name: colorName?.trim() || "Default", hex: hex?.trim() || "#c9a84c" };
    }),
    fabric,
    occasion: parseList(occasion),
    tags: parseList(tags),
    rating: Number(rating),
    reviewCount: Number(reviewCount),
    stock: Number(stock),
    isBestseller,
    isNew,
    isBridal,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = buildPayload();
      const res = await fetch("/api/admin/products", {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initial ? { id: initial._id, ...payload } : payload),
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      toast.success(initial ? "Product updated" : "Product created");
      onSuccess();
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelClass}>Product Name *</label>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Slug</label>
          <input
            className={inputClass}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={slugify(name) || "auto-generated"}
          />
        </div>
        <div>
          <label className={labelClass}>Category *</label>
          <select
            className={inputClass}
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as Product["category"])
            }
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea
            className={`${inputClass} min-h-[120px]`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Price (INR) *</label>
          <input
            type="number"
            className={inputClass}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Original Price (sale)</label>
          <input
            type="number"
            className={inputClass}
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Image URLs (comma-separated)</label>
          <input
            className={inputClass}
            value={images}
            onChange={(e) => setImages(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Sizes (comma-separated)</label>
          <input
            className={inputClass}
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Colors (Name|#hex, …)</label>
          <input
            className={inputClass}
            value={colors}
            onChange={(e) => setColors(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Fabric</label>
          <input
            className={inputClass}
            value={fabric}
            onChange={(e) => setFabric(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Stock</label>
          <input
            type="number"
            className={inputClass}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Occasions (comma-separated)</label>
          <input
            className={inputClass}
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Tags (comma-separated)</label>
          <input
            className={inputClass}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Rating</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            className={inputClass}
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Review Count</label>
          <input
            type="number"
            className={inputClass}
            value={reviewCount}
            onChange={(e) => setReviewCount(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        {[
          ["Bestseller", isBestseller, setIsBestseller],
          ["New Arrival", isNew, setIsNew],
          ["Bridal", isBridal, setIsBridal],
        ].map(([label, checked, setter]) => (
          <label key={label as string} className="flex items-center gap-2 text-sm text-[#8a7d6e]">
            <input
              type="checkbox"
              checked={checked as boolean}
              onChange={(e) => (setter as (v: boolean) => void)(e.target.checked)}
              className="accent-[#c9a84c]"
            />
            {label as string}
          </label>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0a0806] px-6 py-3 text-[0.75rem] font-semibold tracking-[0.12em] uppercase hover:bg-[#e8c96a] disabled:opacity-60"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {initial ? "Update Product" : "Create Product"}
        </button>
        <Link
          href="/admin/products"
          className="inline-flex items-center px-6 py-3 border border-[#c9a84c]/20 text-[#8a7d6e] text-[0.75rem] tracking-[0.1em] uppercase hover:border-[#c9a84c]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

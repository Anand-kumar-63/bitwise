"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Offer, OfferInput, Product } from "@/types";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const inputClass =
  "w-full bg-[#0a0806] border border-[#c9a84c]/20 text-[#f0e8dc] px-4 py-2.5 text-sm focus:outline-none focus:border-[#c9a84c]/50";
const labelClass =
  "text-[0.65rem] uppercase tracking-[0.15em] text-[#6b6258] block mb-1.5";

interface OfferFormProps {
  initial?: Offer;
}

export default function OfferForm({ initial }: OfferFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [bannerText, setBannerText] = useState(initial?.bannerText ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [discountPercent, setDiscountPercent] = useState(
    String(initial?.discountPercent ?? 10)
  );
  const [scope, setScope] = useState<Offer["scope"]>(
    initial?.scope ?? "sitewide"
  );
  const [category, setCategory] = useState<Product["category"]>(
    initial?.category ?? "lehenga"
  );
  const [productIds, setProductIds] = useState<string[]>(
    initial?.productIds ?? []
  );
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [startsAt, setStartsAt] = useState(
    initial?.startsAt ? initial.startsAt.slice(0, 10) : ""
  );
  const [endsAt, setEndsAt] = useState(
    initial?.endsAt ? initial.endsAt.slice(0, 10) : ""
  );

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: OfferInput = {
      title,
      description,
      bannerText: bannerText || title,
      code: code || undefined,
      discountPercent: Number(discountPercent),
      scope,
      category: scope === "category" ? category : undefined,
      productIds: scope === "product" ? productIds : [],
      isActive,
      startsAt: startsAt || undefined,
      endsAt: endsAt || undefined,
    };

    try {
      const res = await fetch("/api/admin/offers", {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initial ? { id: initial._id, ...payload } : payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast.success(initial ? "Offer updated" : "Offer created");
      router.push("/admin/offers");
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
          <label className={labelClass}>Offer Title *</label>
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Banner Text (shown on homepage)</label>
          <input
            className={inputClass}
            value={bannerText}
            onChange={(e) => setBannerText(e.target.value)}
            placeholder={title || "Offer headline"}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea
            className={`${inputClass} min-h-[90px]`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Discount % *</label>
          <input
            type="number"
            min="1"
            max="90"
            className={inputClass}
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Promo Code (optional)</label>
          <input
            className={inputClass}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="FESTIVE10"
          />
        </div>
        <div>
          <label className={labelClass}>Applies To *</label>
          <select
            className={inputClass}
            value={scope}
            onChange={(e) => setScope(e.target.value as Offer["scope"])}
          >
            <option value="sitewide">Entire Store</option>
            <option value="category">Category</option>
            <option value="product">Specific Products</option>
          </select>
        </div>
        {scope === "category" && (
          <div>
            <label className={labelClass}>Category</label>
            <select
              className={inputClass}
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as Product["category"])
              }
            >
              <option value="anarkali">Anarkali</option>
              <option value="lehenga">Lehenga</option>
              <option value="saree">Sarees</option>
              <option value="kurta">Kurtas</option>
            </select>
          </div>
        )}
        <div>
          <label className={labelClass}>Start Date</label>
          <input
            type="date"
            className={inputClass}
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>End Date</label>
          <input
            type="date"
            className={inputClass}
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
          />
        </div>
      </div>

      {scope === "product" && (
        <div>
          <label className={labelClass}>Select Products</label>
          <div className="max-h-48 overflow-y-auto border border-[#c9a84c]/15 p-3 space-y-2">
            {products.map((p) => (
              <label
                key={p._id}
                className="flex items-center gap-2 text-sm text-[#8a7d6e]"
              >
                <input
                  type="checkbox"
                  checked={productIds.includes(p._id)}
                  onChange={(e) => {
                    setProductIds((ids) =>
                      e.target.checked
                        ? [...ids, p._id]
                        : ids.filter((id) => id !== p._id)
                    );
                  }}
                  className="accent-[#c9a84c]"
                />
                {p.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm text-[#8a7d6e]">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="accent-[#c9a84c]"
        />
        Active (visible on website)
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0a0806] px-6 py-3 text-[0.75rem] font-semibold tracking-[0.12em] uppercase hover:bg-[#e8c96a] disabled:opacity-60"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {initial ? "Update Offer" : "Create Offer"}
        </button>
        <Link
          href="/admin/offers"
          className="inline-flex items-center px-6 py-3 border border-[#c9a84c]/20 text-[#8a7d6e] text-[0.75rem] tracking-[0.1em] uppercase"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

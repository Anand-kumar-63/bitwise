"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Offer } from "@/types";
import toast from "react-hot-toast";

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/admin/offers")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setOffers(data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete offer "${title}"?`)) return;

    const res = await fetch(`/api/admin/offers?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success("Offer deleted");
      load();
    } else {
      toast.error(data.error ?? "Delete failed");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#f0e8dc] mb-1">Offers</h1>
          <p className="text-sm text-[#8a7d6e]">
            Promotions shown on the homepage and applied to product prices.
          </p>
        </div>
        <Link
          href="/admin/offers/new"
          className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0a0806] px-5 py-2.5 text-[0.72rem] font-semibold tracking-[0.12em] uppercase hover:bg-[#e8c96a]"
        >
          <Plus size={14} /> New Offer
        </Link>
      </div>

      {loading ? (
        <p className="text-[#8a7d6e] text-sm">Loading…</p>
      ) : offers.length === 0 ? (
        <p className="text-[#8a7d6e] text-sm">No offers yet. Create your first promotion.</p>
      ) : (
        <div className="space-y-3">
          {offers.map((o) => (
            <div
              key={o._id}
              className="bg-[#110e0a] border border-[#c9a84c]/12 p-5 flex flex-wrap items-start justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="font-serif text-lg text-[#f0e8dc]">{o.title}</h2>
                  <span
                    className={`text-[0.62rem] uppercase tracking-wider px-2 py-0.5 ${
                      o.isActive
                        ? "bg-[#c9a84c]/15 text-[#c9a84c]"
                        : "bg-[#6b6258]/20 text-[#6b6258]"
                    }`}
                  >
                    {o.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-[#8a7d6e] mb-2">{o.bannerText}</p>
                <div className="flex flex-wrap gap-3 text-[0.72rem] text-[#6b6258]">
                  <span>{o.discountPercent}% off</span>
                  <span className="capitalize">{o.scope}</span>
                  {o.code && <span>Code: {o.code}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/offers/${o._id}/edit`}
                  className="p-2 text-[#8a7d6e] hover:text-[#c9a84c] border border-[#c9a84c]/15"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => handleDelete(o._id, o.title)}
                  className="p-2 text-[#8a7d6e] hover:text-[#c4405a] border border-[#c9a84c]/15"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

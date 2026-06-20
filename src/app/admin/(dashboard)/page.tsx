import Link from "next/link";
import { Package, Tag, Plus, ArrowRight } from "lucide-react";
import { listAllProducts } from "@/lib/products";
import { queryOffers } from "@/lib/offers";
import { isDbConfigured } from "@/lib/env";

export default async function AdminDashboardPage() {
  const [products, offers] = await Promise.all([
    listAllProducts(),
    queryOffers(),
  ]);
  const activeOffers = offers.filter((o) => o.isActive);

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-serif text-3xl text-[#f0e8dc] mb-2">Dashboard</h1>
        <p className="text-sm text-[#8a7d6e]">
          Manage your catalog and promotional offers.
          {!isDbConfigured() && (
            <span className="block mt-1 text-[#c9a84c]">
              Demo mode — changes are stored in memory until you add MONGODB_URI.
            </span>
          )}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Products", value: products.length, icon: Package },
          { label: "Active Offers", value: activeOffers.length, icon: Tag },
          {
            label: "On Sale",
            value: products.filter((p) => p.originalPrice).length,
            icon: Tag,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-[#110e0a] border border-[#c9a84c]/12 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[0.68rem] uppercase tracking-[0.15em] text-[#6b6258]">
                {label}
              </span>
              <Icon size={16} className="text-[#c9a84c]" />
            </div>
            <div className="font-serif text-3xl text-[#f0e8dc]">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/admin/products/new"
          className="group bg-[#110e0a] border border-[#c9a84c]/12 p-6 hover:border-[#c9a84c]/30 transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <Plus size={18} className="text-[#c9a84c]" />
            <span className="font-serif text-lg text-[#f0e8dc]">Add Product</span>
          </div>
          <p className="text-sm text-[#8a7d6e] mb-4">
            Create a new lehenga, anarkali, saree, or kurta listing.
          </p>
          <span className="inline-flex items-center gap-1 text-[0.72rem] text-[#c9a84c] uppercase tracking-wide group-hover:gap-2 transition-all">
            Go <ArrowRight size={12} />
          </span>
        </Link>

        <Link
          href="/admin/offers/new"
          className="group bg-[#110e0a] border border-[#c9a84c]/12 p-6 hover:border-[#c9a84c]/30 transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <Plus size={18} className="text-[#c9a84c]" />
            <span className="font-serif text-lg text-[#f0e8dc]">Create Offer</span>
          </div>
          <p className="text-sm text-[#8a7d6e] mb-4">
            Launch a sitewide, category, or product-specific discount.
          </p>
          <span className="inline-flex items-center gap-1 text-[0.72rem] text-[#c9a84c] uppercase tracking-wide group-hover:gap-2 transition-all">
            Go <ArrowRight size={12} />
          </span>
        </Link>
      </div>
    </div>
  );
}
